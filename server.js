const express = require('express');

const app = express();

app.use(express.json());

const database = {
  users: [
    {
      id: 123,
      email: 'john@email.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },

    {
      id: 1234,
      email: 'sally@email.com',
      password: 'bananas',
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json('success');
  } else {
    res.status(400).json('error log in');
  }
  res.send('success');
});

app.post('/register', (req, res) => {
  const { email, password, name } = req.body;

  database.users.push({
    id: 12345,
    email: email,
    password: password,
    name,
    entries: 0,
    joined: new Date(),
  });

  res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === Number(id)) {
      found = true;
      return res.json(user);
    }
  });

  if (!found) {
    return res.status(404).json('Not found!');
  }
});

app.listen(3000, () => {
  console.log('App is running on port 3000');
});

/*
    -> res = this is working
    -> signin = POST success / fail
    -> register = POST = user
    -> profile/:userId --> GET = user
    -> image --> PUT --> user
 */
