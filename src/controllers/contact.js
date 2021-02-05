import Contact from '../entities/contact';
import logger from '../utils/logger';

/**
 * A simple CRUD controller for contacts
 * Create the necessary controller methods
 */

/**
 * get all contacts for a user
 */
const all = async (req, res) => {
	try {
		const user = req.user;

		const contacts = await Contact.find({ user_id: user._id });

		res.status(200).json({ contacts });
	} catch (err) {
		res.status(500).json({ err: err.message || 'network error' });
	}
};

/**
 * get a single contact
 */
const get = async (req, res) => {
	try {
		const contact = await Contact.findById(req.params.id);

		if (!contact) {
			return res.status(500).json({ err: 'could not find contact' });
		}

		return res.status(200).json({ contact: contact.toJSON() });
	} catch (err) {
		return res.status(500).json({ err: err.message || 'network error' });
	}
};

/**
 * create a single contact
 */
const create = async (req, res) => {
	try {
		const body = req.body;

		const contact = await Contact.create({
			user_id: body.user_id,
			name: body.name,
			phone: body.phone,
		});

		return res.status(201).json({ contact: contact.toJSON() });
	} catch (err) {
		if (err.name == 'ValidationError') {
			return res.status(422).json(err);
		} else {
			return res.status(500).json({ err: err.message || 'network error' });
		}
	}
};

/**
 * update a single contact
 */
const update = async (req, res) => {
	try {
		const contact = await Contact.findById(req.params.id);

		if (!contact) {
			return res.status(500).json({ err: 'could not find contact' });
		}

		const body = req.body;

		contact.name = body.name;
		contact.phone = body.phone;
		const rs = await contact.save();

		return res.status(200).json({ contact: rs.toJSON() });
	} catch (err) {
		return res.status(500).json({ err: err.message || 'network error' });
	}
};

/**
 * remove a single contact
 */
const remove = async (req, res) => {
	try {
		const contact = await Contact.findById(req.params.id);

		if (!contact) {
			return res.status(500).json({ err: 'could not find contact' });
		}

		await contact.remove();

		return res.status(200).json({ message: 'contact deleted' });
	} catch (err) {
		return res.status(500).json({ err: err.message || 'network error' });
	}
};

export default {
	// get all contacts for a user
	all,
	// get a single contact
	get,
	// create a single contact
	create,
	// update a single contact
	update,
	// remove a single contact
	remove,
};
