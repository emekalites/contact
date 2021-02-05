import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import mongooseStringQuery from 'mongoose-string-query';
import uniqueValidator from 'mongoose-unique-validator';

export const ContactSchema = new Schema(
	{
		//  define the necessary fields for your contact list
		user_id: {
			type: String,
			index: true,
			required: [true, 'Select user.'],
		},
		name: {
			type: String,
			trim: true,
			required: [true, 'Name cannot be empty.'],
		},
		phone: {
			type: String,
			trim: true,
			unique: true,
			required: [true, 'Enter phone number.'],
		},
	},
	{ collection: 'contacts' }
);

ContactSchema.plugin(timestamps);
ContactSchema.plugin(mongooseStringQuery);

ContactSchema.plugin(uniqueValidator, {
	message: '{VALUE} already taken!',
});

ContactSchema.methods = {
	/**
	 * Parse the contact object in data we wanted to send
	 *
	 * @public
	 * @returns {Object} Contact - ready for populate
	 */
	toJSON() {
		return {
			_id: this._id,
			user_id: this.user_id,
			name: this.name,
			phone: this.phone,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	},
};

module.exports = exports = mongoose.model('Contact', ContactSchema);
