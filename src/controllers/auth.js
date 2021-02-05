import crypto from 'crypto';
import nodemailer from 'nodemailer';

import User from '../entities/user';
import logger from '../utils/logger';

/**
 * Given a json request
 * {"username": "<...>", "password": "<...>"}
 * Verify the user is valid and return some authentication token
 * which can be used to verify protected resources
 * {"user": <{...}>, "token": "<...>""}
 */
const login = (req, res) => {
	try {
		const user = req.user;

		if (user) {
			const token = user.createToken();

			return res.status(200).json({ user: user.toJSON(), token });
		}

		return res.status(500).json({ err: 'invalid login credentials' });
	} catch (err) {
		res.status(500).json({ err: err.message || 'network error' });
	}
};
/**
 * Given a json request
 * {"username": "<...>", "password": "<...>"}
 * Create a new user and return some authentication token
 * which can be used to verify protected resources
 * {"user": <{...}>, "token": "<...>""}
 */
const signup = async (req, res) => {
	try {
		const body = req.body;

		const user = await User.create({
			email: body.email,
			username: body.username,
			password: body.password,
			name: body.name,
		});

		const token = user.createToken();

		return res.status(201).json({ user: user.toJSON(), token });
	} catch (err) {
		console.log(err);
		if (err.name == 'ValidationError') {
			res.status(422).json(err);
		} else {
			res.status(500).json({ err: err.message || 'network error' });
		}
	}
};

/**
 * Implement a way to recover user accounts
 */
const forgotPassword = async (req, res) => {
	try {
		const body = req.body;

		const user = await User.findOne({ email: body.email });

		if (!user) {
			return res.status(500).json({ error: 'email not found' });
		}

		const token = crypto.randomBytes(32).toString('hex');

		const option = {
			host: process.env.SMTP_HOST,
			port: 587,
			secure: false,
			auth: {
				user: process.env.SMTP_USERNAME,
				pass: process.env.SMTP_PASSWORD,
			},
		};
		const transporter = nodemailer.createTransport(option);
		const message = {
			from: 'test@mail.com',
			to: body.email,
			subject: 'rescover password',
			html: `<p>Hi ${user.name}</p><p>Paste this link in your browser to recover your password: <br/>https://doman.com/recover-password/${token}</p>`,
		};
		const sent = await transporter.sendMail(message);
		logger.info(sent);

		if (sent) {
			return res
				.status(200)
				.json({ message: 'check your email to reset your password' });
		}

		res.status(500).json({ err: 'failed to send email, network error' });
	} catch (e) {
		res.status(500).json({ err: err.message || 'network error' });
	}
};

export default {
	login,
	signup,
	forgotPassword,
};
