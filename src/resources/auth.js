import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import Auth from '../controllers/auth';
import User from '../entities/user';

/**
 * Local Strategy Auth
 */
const localLogin = new LocalStrategy(
	{ usernameField: 'username' },
	async (username, password, done) => {
		try {
			const user = await User.findOne({ username });

			if (!user) {
				return done(null, false, { message: 'invalid username' });
			} else if (!user.authenticateUser(password)) {
				return done(null, false, { message: 'invalid password' });
			}

			return done(null, user);
		} catch (e) {
			return done(e, false);
		}
	}
);

passport.use(localLogin);

module.exports = (app) => {
	app.post(
		'/auth/login',
		passport.authenticate('local', {
			session: false,
			failWithError: true,
		}),
		Auth.login
	);
	app.route('/auth/signup').post(Auth.signup);

	/*** BONUS POINTS ***/
	app.route('/auth/forgotPassword').post(Auth.forgotPassword);
};
