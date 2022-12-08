import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import bodyParser from 'body-parser';
import cors from 'cors';
import knex from 'knex';
import pg from 'pg';

import { handleImage } from './controllers/imageHandler.js';
import { handleRegister } from './controllers/register.js';
import { handleSignin } from './controllers/handleSignin.js';
import { getUser } from './controllers/getUser.js';
import { getAllUser } from './controllers/getAllUser.js';

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

app.get('/', (req, res, db) => {
  getAllUser(req, res, db);
});

app.post('/signin', (req, res) => handleSignin(req, res, db, bcrypt));

app.post('/register', (req, res) => {
  handleRegister(req, res, db, bcrypt);
});

app.get('/profile/:id', (req, res) => {
  getUser(req, res, db);
});

app.put('/image', (req, res, db) => {
  handleImage(req, res, db);
});

app.listen(8000, () => {
  console.log('App is running on port 8000');
});
