/*
START HERE
NOTE:
Don't forget to implement user authentication for the
contact resource
*/
require('dotenv').config();

import fs from 'fs';
import path from 'path';
import express from 'express';
import expressWinston from 'express-winston';
import bodyParser from 'body-parser';
import winston from 'winston';
import compression from 'compression';
import cors from 'cors';
import helmet from 'cors';
import passport from 'passport';
import methodOverride from 'method-override';
import logger from './utils/logger';

const app = express();

const port = 3001;
const env = process.env.NODE_ENV || 'development';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(compression()); // add compression response bodies
app.use(cors()); // allow or restrict requested resources
app.use(helmet()); // help protect app from some web vulnerabilities
app.use(passport.initialize()); // express authentication middleware
app.use(methodOverride()); // allows the usage of http verbs like put or delete

// app.use(
// 	expressWinston.logger({
// 		transports: [
// 			new winston.transports.Console({
// 				json: true,
// 				colorize: true,
// 			}),
// 		],
// 		meta: true, // optional: control whether you want to log the meta data about the request (default to true)
// 		msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
// 		expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
// 		colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
// 		ignoreRoute: function (req, res) {
// 			return false;
// 		}, // optional: allows to skip some log messages based on request and/or response
// 	})
// );

app.listen(port, (err) => {
	if (err) {
		logger.error(err);
		process.exit(1);
	}
	require('./utils/db');

	fs.readdirSync(path.join(__dirname, 'resources')).map((file) => {
		require('./resources/' + file)(app);
	});

	logger.info(`app is now running on port ${port} in ${env} mode`);
});

module.exports = app;
