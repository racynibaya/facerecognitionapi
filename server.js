import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

import { handleImage, handleApiCall } from './controllers/image.js';
import { getUser } from './controllers/profile.js';
import { handleRegister } from './controllers/register.js';
import { handleSignin } from './controllers/signin.js';
import { users } from './controllers/users.js';

const db = knex({
  client: 'pg',
  version: 15.1,
  connection: {
    host: 'dpg-cedng3cgqg43c91lqga0-a',
    user: 'smart_brain_db_gz76_user',
    port: 5432,
    password: process.env.DB_PASSWORD,
    database: 'smart_brain_db_gz76',
  },
});

const app = express();

// Express has built in parser
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => res.json('It is working'));

app.get('/a', users(db));
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
  handleApiCall(req, res);
});

const PORT = process.env.PORT;
app.listen(PORT || 8000, () => {
  console.log(`App is running on port ${PORT || 8000}`);
});
