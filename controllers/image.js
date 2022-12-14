import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: 'ddedab0c5dd94e1589aebfe97f4fadff',
});

export const imageUrl = (req, res) => {
  const { input } = req.body;
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, input)
    .then(data => res.json(data))
    .catch(err => res.status(404).json('Invalid Url'));
};

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
