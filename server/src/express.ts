/* eslint-disable no-console */
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { expressErrorHandle } from './utils/middleware';
import { sendNotFound } from './utils/misc';

import listingsRoute from './routes/listings';
import authRoute from './routes/auth';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use('/assets', express.static('public'));
app.use(express.json());
app.use(express.static('./public'));
app.use(expressErrorHandle('Invalid JSON'));

app.use('/api/listings', listingsRoute);
app.use('/api/auth', authRoute);

app.use('*', (req, res) => {
  sendNotFound(res);
});

app.listen(process.env.EXPRESS_PORT, () => {
  console.log(`Listening @ PORT: ${process.env.EXPRESS_PORT}`);
});
