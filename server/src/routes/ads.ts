import express from 'express';
import { sqlConnect } from '../utils/db';
import { sendSuccess, sendServerError, sendUserError } from '../utils/misc';

const router = express.Router();

// sqlConnect('SELECT * FROM ads')
//   .then(([data]) => {
//     sendSuccess(res, data);
//   })
//   .catch(() => {
//     sendServerError(res, 'Internal Error');
//   });

router.get('/', (req, res) => {
  sqlConnect(
    `SELECT locations.id, title, price, phone_number, categories.category, featured, sold, created, updated, locations.city
    FROM ads
    LEFT JOIN locations
    ON ads.location_id = locations.id
    LEFT JOIN categories
    ON ads.category_id = categories.id`
  )
    .then(([data]) => {
      sendSuccess(res, data);
    })
    .catch((err) => {
      console.log(err);
      sendServerError(res, 'Internal Error');
    });
});

router.get('/featured', (req, res) => {
  sqlConnect(
    `SELECT ads.id, title, price, phone_number, categories.category, featured, sold, created, updated, locations.city
    FROM ads
    LEFT JOIN locations
    ON ads.location_id = locations.id
    LEFT JOIN categories
    ON ads.category_id = categories.id
    WHERE featured = 1`
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
    'SELECT id, title, price, body, phone_number, city, category, featured, sold, created, updated FROM ads WHERE id = ?',
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

router.post('/', express.json(), (req, res) => {
  let { title, image } = req.body;
  const price = Number(req.body.price);
  const numberplates = req.body?.numberplates;

  if (typeof title !== 'string' || title.length < 2 || title.length > 150) {
    return sendUserError(res, 'Invalid title');
  }
  title = title.trim();

  if (typeof image !== 'string' || image.length < 5 || image.length > 150) {
    return sendUserError(res, 'Invalid image');
  }
  image = image.trim();

  if (typeof numberplates !== 'string' || numberplates.length !== 6) {
    return sendUserError(res, 'Invalid number plate');
  }

  if (Number.isNaN(price) || price < 1) {
    return sendUserError(res, 'Invalid price');
  }

  sqlConnect(
    'INSERT INTO cars (title, image, numberplates, price) VALUES (?, ?, ?, ?) LIMIT 1',
    [title, image, numberplates, price]
  )
    .then(([data]) => {
      if (data.affectedRows > 0) {
        sendSuccess(res, 'Car added');
      } else {
        sendUserError(res, 'Car not added');
      }
    })
    .catch(() => {
      sendServerError(res, 'Internal Error');
    });
});

export default router;
