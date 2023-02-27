export const getUser = (req, res, db) => {
  const { id } = req.params;

  db.select('*')
    .from('users')
    .where({ id })
    .then(response => {
      if (response.length) res.json(response[0]);
      else throw new Error('Not found');
    })
    .catch(err => res.status(404).json(err.message));
};
