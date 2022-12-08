export const getAllUser = (req, res, db) => {
  db.select('*')
    .from('users')
    .then(response => res.json(response))
    .catch(err => res.status(404).json(err));
};
