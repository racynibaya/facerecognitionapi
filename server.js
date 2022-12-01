import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

const database = {
  users: [
    {
      id: 123,
      email: 'john@email.com',
      name: 'John',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },

    {
      id: 1234,
      email: 'sally@email.com',
      name: 'Sally',
      password: 'bananas',
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(database.users);
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

  // bcrypt.hash(password, null, null, function (err, hash) {
  //   // Store hash in your password DB.
  //   console.log(hash);
  // });

  // Load hash from your password DB.
  bcrypt.compare(
    'eagle',
    '$2a$10$JpRozF.9HgluGKMG5qtThuRzbh1ARR1PF.M.2C2Z68MsqA.6MAS5G',
    function (err, res) {
      // res == true
      console.log(res);
    }
  );
  bcrypt.compare(
    'veggies',
    '$2a$10$JpRozF.9HgluGKMG5qtThuRzbh1ARR1PF.M.2C2Z68MsqA.6MAS5G',
    function (err, res) {
      // res = false
      console.log(res);
    }
  );

  database.users.push({
    id: 125,
    email: email,
    name: name,
    password: password,
    entries: 0,
    joined: new Date(),
  });

  res.json(database.users[database.users.length - 1]);
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
