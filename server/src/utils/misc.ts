import express from 'express';
import Joi from 'joi';

export function sendSuccess(res: express.Response, data: Object) {
  return res.status(200).send({
    success: true,
    data,
  });
}

export function sendServerError(res: express.Response, data: Object) {
  return res.status(500).send({
    success: false,
    error: data,
  });
}

export function sendUserError(res: express.Response, data: Object) {
  return res.status(400).send({
    success: false,
    error: data,
  });
}

export function sendNotAuthorized(res: express.Response, data: Object) {
  return res.status(401).send({
    success: false,
    error: data,
  });
}

export function sendNotFound(res: express.Response) {
  return res.status(401).send({
    success: false,
    error: 'Route not found',
  });
}