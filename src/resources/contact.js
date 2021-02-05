import Contact from '../controllers/contact';

/**
 * Contact api routes
 */
module.exports = (app) => {
	app.route('/contact/all').get(Contact.all);
	app.route('/contact/get/:id').get(Contact.get);
	app.route('/contact/create').post(Contact.create);
	app.route('/contact/update/:id').put(Contact.update);
	app.route('/contact/delete/:id').delete(Contact.remove);
};
