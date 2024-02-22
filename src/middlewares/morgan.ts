/**
 * @fileoverview This module provides a custom middleware for logging HTTP requests in an Express.js application using the `morgan` library.
 * @module morganMiddleware
 * @requires morgan
 * @requires ../utils/winstonLogger
 */

import morgan from "morgan";
import { logger } from "../utils/winstonLogger";

/**
 * @typedef {Function} MorganMiddleware
 * @description A custom middleware function that uses `morgan` to generate log messages based on the incoming HTTP requests.
 * @param {Object} tokens - An object containing functions to extract various details from the request and response objects.
 * @returns {undefined} The function returns `undefined`, indicating that logging is handled internally without altering the logging behavior of `morgan`.
 */

/**
 * The custom middleware function for logging HTTP requests.
 * @type {MorganMiddleware}
 */
export const morganMiddleware = () => {
  return morgan((tokens, req, res) => {
    // Construct the log message.
    const logMessage = `[${tokens.method(req, res)}] ${tokens.url(
      req,
      res
    )} | ${tokens.status(req, res)}
	 | ${tokens.res(req, res, "content-length")} - ${tokens["response-time"](
     req,
     res
   )} ms |
	[Response] `;

    // Check the response status code.
    const statusCode = res.statusCode;
    // If the status code is less than 400, log the message as an informational log.
    if (statusCode < 400) {
      logger.info(logMessage);
    } else {
      logger.error(logMessage); // Log as error for other status codes
    }

    // Return `undefined` to indicate that logging is handled internally.
    return undefined;
  });
};
