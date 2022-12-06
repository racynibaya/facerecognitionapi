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
    .returning('*')
    .then(response => res.json(response))
    .catch(err => res.status(404).json(err));
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  if (
    database.users.find(
      user => user.email === email && user.password === password
    )
  ) {
    res.json(
      database.users[
        database.users.findIndex(
          user => user.email === email && user.password === password
        )
      ]
    );
  } else {
    res.status(400).json('error log in');
  }
  res.send('success');
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  bcrypt.hash(password, null, null, function (err, hash) {
    db.from('login').insert({ hash: hash });
  });

  db.from('users')
    .returning('*')
    .insert({
      email,
      name,
      joined: new Date(),
    })
    .then(response => res.json(response[0]))
    .catch(err => res.status(404).json(err));
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  console.log(typeof id);
  let found = false;
  database.users.forEach(user => {
    if (user.id.toString() === id) {
      found = true;
      return res.json(user);
    }
  });

  if (!found) {
    return res.status(404).json('Not found!');
  }
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === Number(id)) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });

  if (!found) {
    return res.status(404).json('Not found!');
  }
});

app.listen(8000, () => {
  console.log('App is running on port 8000');
});
