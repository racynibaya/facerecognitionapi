export const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json('Invalid submission');
  }

  db.select('email', 'hash')
    .from('login')
    .where('email', email)
    .then(user => {
      const { hash, email } = user[0];
      const isValid = bcrypt.compareSync(password, hash);

      if (isValid) {
        db.select('*')
          .from('users')
          .where('email', email)
          .then(user => res.json(user[0]))
          .catch(err => res.status(404).json(err.message));
      } else {
        throw new Error('User not found');
      }
    })
    .catch(err => res.status(404).json(err.message));
};
