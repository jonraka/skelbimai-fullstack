import express from "express";
import { sendUserError } from './misc';

export function expressErrorHandle(errorMessage = 'error') {
	return function HandleErr(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
		if (err) return sendUserError(res, errorMessage);
		next();
	};
}