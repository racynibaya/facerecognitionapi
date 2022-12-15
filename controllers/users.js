export const users = db => (req, res) => {
  res.json('It is working');
  db.select('*')
    .from('users')
    .orderBy('id', 'desc')
    .then(response => res.json(response))
    .catch(err => res.status(404).json(err));
};

console.log(users());
