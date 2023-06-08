import passport from "passport"
import local from "passport-local"
import passport_jwt from "passport-jwt"
import { UserService, CartService } from "../repository/index.js"
import { createHash, isValidPassword, extractCookie, generateToken } from "../utils.js"
import GitHubStrategy from "passport-github2"
import config from "./config.js"

const LocalStrategy = local.Strategy
const JWTStrategy = passport_jwt.Strategy
const ExtractJWT = passport_jwt.ExtractJwt

const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {

        const {
            first_name,
            last_name,
            email,
            age
        } = req.body
        try {
            const user = await UserService.getOneByEmail(username)
            if (user) {
                req.logger.info("User already exits");
                return done(null, false)
            }

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: await CartService.create({})
            }
            if (!first_name || !last_name || !email || !age) {
                req.logger.error("")
            } else {
                const result = await UserService.create(newUser)
                return done(null, result)
            }
        } catch (error) {
            return done("[LOCAL] user error " + error)
        }

    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await UserService.getOneByEmail(username)
            if (!user) {
                console.log("User doesnt exist");
                return done(null, user)
            }

            if (!isValidPassword(user, password)) return done(null, false)
            const token = generateToken(user, "24h")
            user.token = token

            return done(null, user)
        } catch (error) {
            console.log("error")
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.5142e476e3af578e",
        clientSecret: "a749a51def76a2d9baa039c1999050fbd544d52a",
        callbackURL: "http://127.0.0.1:8080/api/session/githubcallback"
    }, async(accessToken, refreshToken, profile, done) => {
        console.log(profile);

        try {
            const user = await UserService.getOneByEmail(username)
            if(user) return done(null, user)

            const newUser = await UserService.create({
                first_name: profile._json.name,
                last_name: "",
                email: profile._json.email,
                role: 'user',
                social: 'local',
                password: createHash(password)
            })

            return done(null, newUser)
        } catch (error) {
            return done('error to login with github' + error)
        }
    }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
        secretOrKey: config.jwtPrivateKey
    }, async (jwt_payload, done) => {
        done(null, jwt_payload)
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserService.getOneByID(id)
        done(null, user)
    })

}

export default initializePassport