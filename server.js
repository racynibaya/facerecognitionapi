import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import bodyParser from 'body-parser';
import cors from 'cors';
import knex from 'knex';
import pg from 'pg';

const db = knex({
  client: 'pg',
  version: 15.1,
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    port: 5432,
    password: 'test',
    database: 'smart-brain',
  },
});

const app = express();

// Express has built in parser
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
  db.select('*')
    .from('users')
    .then(response => res.json(response))
    .catch(err => res.status(404).json(err));
});

app.post('/signin', (req, res) => {
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
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

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
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;

  db.select('*')
    .from('users')
    .where({ id })
    .then(response => {
      if (response.length) res.json(response[0]);
      else throw new Error('Not found');
    })
    .catch(err => res.status(404).json(err.message));
});

app.put('/image', (req, res) => {
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
});

app.listen(8000, () => {
  console.log('App is running on port 8000');
});
