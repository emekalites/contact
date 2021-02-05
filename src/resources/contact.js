import Contact from '../controllers/contact';
import authJwt from '../utils/auth';

/**
 * Contact api routes
 */
module.exports = (app) => {
	app.get('/contact', authJwt, Contact.all);
	app.get('/contact/:id', authJwt, Contact.get);
	app.post('/contact/create', authJwt, Contact.create);
	app.put('/contact/:id', authJwt, Contact.update);
	app.delete('/contact/:id', authJwt, Contact.remove);
};
