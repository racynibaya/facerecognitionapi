export const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.json('incorrect submission');
  }

  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx
      .insert({
        email,
        hash,
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx
          .insert({
            email: loginEmail[0].email,
            name,
            joined: new Date(),
          })
          .into('users')
          .returning('*')
          .then(users => {
            res.json(users[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(404).json('Unable to register'));
};
