import mongoose from 'mongoose';
import logger from './logger';

mongoose.Promise = global.Promise;

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URI}/contact`;
const dev = process.env.NODE_ENV || 'development';

const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
};
const connection = mongoose.connect(uri, options);

connection
	.then((db) => {
		logger.info(
			`Successfully connected to ${uri} MongoDB cluster in ${dev} mode.`
		);
		return db;
	})
	.catch((err) => {
		if (err.message.code === 'ETIMEDOUT') {
			logger.info('Attempting to re-establish database connection.');
			mongoose.connect(uri);
		} else {
			logger.error('Error while attempting to connect to database:');
			logger.error(err);
		}
	});

export default connection;
