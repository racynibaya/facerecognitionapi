import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import bodyParser from 'body-parser';
import cors from 'cors';
import knex from 'knex';
import pg from 'pg';

import { handleImage, imageUrl } from './controllers/image.js';
import { getUser } from './controllers/profile.js';
import { handleRegister } from './controllers/register.js';
import { handleSignin } from './controllers/signin.js';
import { users } from './controllers/users.js';

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

app.get('/', users(db));

// handleSignin returns a function
app.post('/signin', handleSignin(db, bcrypt));

app.post('/register', (req, res) => {
  handleRegister(req, res, db, bcrypt);
});

app.get('/profile/:id', (req, res) => {
  getUser(req, res, db);
});

app.put('/image', (req, res) => {
  handleImage(req, res, db);
});

app.post('/imageUrl', (req, res) => {
  imageUrl(req, res);
});

app.listen(8000, () => {
  console.log('App is running on port 8000');
});
