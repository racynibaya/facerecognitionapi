export const handleImage = (req, res, db) => {
  const { id } = req.body;

  db.from('users')
    .where({ id: id })
    .increment('entries', 1)
    .returning('entries')
    .then(response => {
      const { entries } = response[0];
      res.json(entries);
    })
    .catch(err => res.status(404).json('Unable to get entries'));
};
