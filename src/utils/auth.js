import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

/**
 * JWT Strategy Auth
 */
const jwtLogin = new JWTStrategy(
	{
		jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
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
