import { ClarifaiStub, grpc } from 'clarifai-nodejs-grpc';

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set('authorization', 'Key ddedab0c5dd94e1589aebfe97f4fadff');

import Clarifai from 'clarifai';

// const app = new Clarifai.App({
//   apiKey: 'ddedab0c5dd94e1589aebfe97f4fadff',
// });

console.log(Clarifai);
export const handleApiCall = (req, res) => {
  const { input } = req.body;

  stub.PostModelOutputs(
    {
      // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
      model_id: 'a403429f2ddf4b49b307e318f00e528b',
      inputs: [{ data: { image: { url: input } } }],
    },
    metadata,
    (err, response) => {
      if (err) {
        console.log('Error: ' + err);
        return;
      }

      if (response.status.code !== 10000) {
        console.log(
          'Received failed status: ' +
            response.status.description +
            '\n' +
            response.status.details
        );
        return;
      }

      console.log('Predicted concepts, with confidence values:');
      for (const c of response.outputs[0].data.concepts) {
        console.log(c.name + ': ' + c.value);
      }

      res.json(response);
    }
  );
  // app.models
  //   .predict(Clarifai.FACE_DETECT_MODEL, input)
  //   .then(data => res.json(data))
  //   .catch(err => res.status(404).json('Invalid Url'));
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
