import passport from "passport"
import { UserService } from "../repository/index.js"
import GitHubStrategy from "passport-github2"
import config from "./config.js"


const initializePassport = () => {


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
}

export default initializePassport