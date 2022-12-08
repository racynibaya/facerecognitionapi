export const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;

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
        res.json('Email or password unmatched');
      }
    })
    .catch(err => res.status(404).json('User not found!'));
};
