import mongoose, { Schema } from 'mongoose';
import bcrypt from 'mongoose-bcrypt';
import timestamps from 'mongoose-timestamp';
import mongooseStringQuery from 'mongoose-string-query';
import uniqueValidator from 'mongoose-unique-validator';
import jwt from 'jsonwebtoken';
import { compareSync } from 'bcrypt-nodejs';

export const UserSchema = new Schema(
	{
		email: {
			type: String,
			lowercase: true,
			trim: true,
			index: true,
			unique: true,
			required: [true, 'Your email cannot be empty.'],
		},
		username: {
			type: String,
			lowercase: true,
			trim: true,
			index: true,
			unique: true,
			required: [true, 'Your username cannot be empty.'],
		},
		password: {
			type: String,
			required: [true, 'Your password cannot be empty.'],
			bcrypt: true,
		},
		name: {
			type: String,
			trim: true,
			required: [true, 'Your name cannot be empty.'],
		},
	},
	{ collection: 'users' }
);

UserSchema.plugin(bcrypt);
UserSchema.plugin(timestamps);
UserSchema.plugin(mongooseStringQuery);

UserSchema.plugin(uniqueValidator, {
	message: '{VALUE} already taken!',
});

UserSchema.index({ email: 1, username: 1 });

UserSchema.methods = {
	/**
	 * Authenticate the user by checking password match
	 */
	authenticateUser(password) {
		return compareSync(password, this.password);
	},

	/**
	 * Generate a jwt token for authentication
	 */
	createToken() {
		const date = new Date();
		const timestamp = date.getTime() + parseInt(process.env.JWT_EXPIRATION, 10);
		const expiry_date = new Date(timestamp);

		return jwt.sign(
			{
				_id: this._id,
				email: this.email,
				expiry_date: expiry_date.toISOString(),
			},
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_EXPIRATION,
			}
		);
	},

	/**
	 * Parse the user object in data we want to send
	 */
	toJSON() {
		return {
			_id: this._id,
			email: this.email,
			username: this.username,
			name: this.name,
		};
	},
};

module.exports = exports = mongoose.model('User', UserSchema);
