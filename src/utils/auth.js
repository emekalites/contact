import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../entities/user';
import logger from '../utils/logger';

/**
 * JWT Strategy Auth
 */
const jwtLogin = new Strategy(
	{
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: process.env.JWT_SECRET,
	},
	async (payload, done) => {
		try {
			const user = await User.findById(payload._id);

			if (!user) {
				return done(null, false);
			}

			return done(null, user);
		} catch (e) {
			return done(e, false);
		}
	}
);

passport.use(jwtLogin);

const authJwt = passport.authenticate('jwt', {
	session: false,
	failWithError: true,
});

export default authJwt;
