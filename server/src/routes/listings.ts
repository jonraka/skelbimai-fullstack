import express from 'express';
import { sqlConnect, sqlConnectMulti } from '../utils/db';
import {
  sendSuccess,
  sendServerError,
  sendUserError,
  sendNotAuthorized,
} from '../utils/misc';
import Joi from 'joi';

const router = express.Router();

const newListingSchema = Joi.object({
  title: Joi.string().min(5).max(30).required(),
  price: Joi.number().min(0).required(),
  phone_number: Joi.string().min(5).max(15).required(),
  city: Joi.number().min(1).required(),
  category: Joi.number().min(1).required(),
  body: Joi.string().min(10).max(2000).required(),
});

router.get('/featured', (req, res) => {
  sqlConnect(
    `SELECT ads.id, title, price, phone_number, categories.category, featured, sold, created, updated, locations.city
    FROM ads
    LEFT JOIN locations
    ON ads.location_id = locations.id
    LEFT JOIN categories
    ON ads.category_id = categories.id
    WHERE featured = 1 AND sold = 0`
  )
    .then(([data]) => {
      sendSuccess(res, data);
    })
    .catch((err) => {
      console.log(err);
      sendServerError(res, 'Internal Error');
    });
});

router.get('/new-listing-data', (req, res) => {
  sqlConnectMulti(async (connection) => {
    const [categories]: any = await connection.execute(
      'SELECT id, category FROM categories ORDER BY category DESC'
    );

    const [locations]: any = await connection.execute(
      'SELECT id, city FROM locations ORDER BY city DESC'
    );

    sendSuccess(res, {
      categories,
      locations,
    });
  }).catch((err) => {
    console.log(err);
    sendServerError(res, 'Internal error');
  });
});

router.get('/', (req, res) => {
  sqlConnect(
    `SELECT ads.id, title, price, categories.category, featured, sold, created, locations.city
    FROM ads
    LEFT JOIN locations
    ON ads.location_id = locations.id
    LEFT JOIN categories
    ON ads.category_id = categories.id
    WHERE sold = 0`
  )
    .then(([data]) => {
      sendSuccess(res, data);
    })
    .catch((err) => {
      console.log(err);
      sendServerError(res, 'Internal Error');
    });
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id < 1) sendUserError(res, 'Invalid ID');

  sqlConnect(
      `
        SELECT
          ads.id, title, price, categories.category, featured, sold, created, locations.city, body
        FROM ads
        LEFT JOIN locations
        ON ads.location_id = locations.id
        LEFT JOIN categories
        ON ads.category_id = categories.id
        WHERE ads.id = ?
      `,
    [id]
  )
    .then(([data]) => {
      if (!data?.length) {
        sendUserError(res, 'Ad not found');
      } else {
        sendSuccess(res, data?.[0]);
      }
    })
    .catch((err) => {
      console.log(err);
      sendServerError(res, 'Internal Error');
    });
});

router.post('/', express.urlencoded({extended: true}), (req, res) => {
  const { authentication } = req.headers;
  console.log(req.body)

  if (!authentication) {
    sendNotAuthorized(res, 'No token provided');
    return;
  }

  const token = String(authentication).replace('Bearer ', '');

  if (token.length < 30) {
    sendNotAuthorized(res, 'Token is invalid');
    return;
  }

  const { value: body, error } = newListingSchema.validate(req.body);

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
      'SELECT * FROM users WHERE access_token = ? LIMIT 1',
      [token]
    );

    const userInDatabase = dbResponse?.[0];

    if (!userInDatabase?.email) {
      sendNotAuthorized(res, 'Invalid token');
      return;
    }

    const [inserted]: any = await connection.execute(
      `
        INSERT INTO ads (
          title,
          price,
          phone_number,
          location_id,
          category_id,
          body,
          user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        body.title,
        body.price,
        body.phone_number,
        body.city,
        body.category,
        body.body,
        userInDatabase.id,
      ]
    );

    if (inserted?.affectedRows > 0) {
      sendSuccess(res, 'Listing added');
    } else {
      sendUserError(res, 'Something went wrong');
    }
  }).catch((err) => {
    console.log(err);
    sendServerError(res, 'Internal Error');
  });
});

export default router;
