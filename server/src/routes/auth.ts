import express from 'express';
import { sqlConnect, sqlConnectMulti } from '../utils/db';
import { sendSuccess, sendServerError, sendUserError } from '../utils/misc';
import Joi from 'joi';
import bcryptjs from 'bcryptjs';
import { nanoid } from 'nanoid';

const router = express.Router();

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string()
    .min(5)
    .max(50)
    // .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
  repeat_password: Joi.ref('password'),
  email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(5)
    .max(50)
    // .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
});

router.post('/register', (req, res) => {
  const { value: body, error } = registerSchema.validate(req.body);
  if (error) {
    sendUserError(
      res,
      error?.details?.map((err) => [
        err?.context?.key,
        err.message.replace(/\"/g, ''),
      ])
    );
    return;
  }

  const hash = bcryptjs.hashSync(body.password);

  sqlConnect(`INSERT INTO users (email, username, password) VALUES (?, ?, ?)`, [
    body.email,
    body.username,
    hash,
  ])
    .then(([data]) => {
      if (data.affectedRows) {
        sendSuccess(res, 'User registered');
      } else {
        sendServerError(res, 'Internal Error');
      }
    })
    .catch((err) => {
      if (err.errno === 1062) {
        sendUserError(res, 'User already exists');
        return;
      }
      console.log(err);
      sendServerError(res, 'Internal Error');
    });
});

router.post('/login', (req, res) => {
  const { value: body, error } = loginSchema.validate(req.body);
  if (error) {
    sendUserError(
      res,
      error?.details?.map((err) => [
        err?.context?.key,
        err.message.replace(/\"/g, ''),
      ])
    );
    return;
  }

  sqlConnectMulti(async (connection) => {
    const [dbResponse]: any = await connection.execute(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [body.email]
    );

    const userInDatabase = dbResponse?.[0];

    if (!userInDatabase?.password) {
      sendUserError(res, 'Email was not found');
      return;
    }

    const isValidPassword = bcryptjs.compareSync(
      body.password,
      userInDatabase.password
    );

    if (!isValidPassword) {
      sendUserError(res, 'Password is invalid');
      return;
    }

    if (userInDatabase?.access_token === null) {
      let newAccessToken = `${userInDatabase.id}-${nanoid(40)}`;

      const [dbNewTokenInsertion]: any = await connection.execute(
        'UPDATE users SET access_token = ?, token_renewed = current_timestamp() WHERE id = ? LIMIT 1',
        [newAccessToken, userInDatabase.id]
      );

      if (dbNewTokenInsertion.affectedRows > 0) {
        sendSuccess(res, {
          accessToken: newAccessToken,
          id: Number(userInDatabase.id),
          username: userInDatabase.username,
          email: userInDatabase.email,
        });
      } else {
        throw new Error(`Can't update a new token`);
      }
    } else {
      sendSuccess(res, {
        accessToken: userInDatabase.access_token,
        id: Number(userInDatabase.id),
        username: userInDatabase.username,
        email: userInDatabase.email,
      });
    }
  }).catch((err) => {
    console.log(err);
    sendServerError(res, 'Internal Error');
  });

  // const hasCompare = bcryptjs.compareSync;

  // sqlConnect(`INSERT INTO users (email, username, password) VALUES (?, ?, ?)`, [
  //   data.email,
  //   data.username,
  //   hash,
  // ])
  //   .then(([data]) => {
  //     if (data.affectedRows) {
  //       sendSuccess(res, data);
  //     } else {
  //       sendServerError(res, 'Internal Error');
  //     }
  //   })
  //   .catch((err) => {
  //     if (err.errno === 1062) {
  //       sendUserError(res, 'User already exists');
  //       return;
  //     }
  //     console.log(err);
  //     sendServerError(res, 'Internal Error');
  //   });
});

router.get('/check-token', async (req, res) => {
  const { authentication } = req.headers;

  if (!authentication) {
    sendUserError(res, 'No token provided');
    return;
  }

  const token = String(authentication).replace('Bearer ', '');

  if (token.length < 30) {
    sendUserError(res, 'Invalid token provided');
    return;
  }

  sqlConnect(
    'SELECT username, email, id FROM users WHERE access_token = ? LIMIT 1',
    [token]
  )
    .then(([data]) => {
      if (!data?.[0]?.username) throw new Error('no user found');
      sendSuccess(res, {
        loggedIn: true,
        username: data[0].username,
        email: data[0].email,
        id: data[0].id,
        accessToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
      sendSuccess(res, { loggedIn: false });
    });
});

export default router;
