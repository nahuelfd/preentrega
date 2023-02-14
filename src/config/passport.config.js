import passport from "passport"
import UserModel from "../dao/models/user.model.js";
import GitHubStrategy from "passport-github2"

const initializePassport = () => {


    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.5142e476e3af578e",
        clientSecret: "a749a51def76a2d9baa039c1999050fbd544d52a",
        callbackURL: "http://127.0.0.1:8080/api/session/githubcallback"
    }, async(accessToken, refreshToken, profile, done) => {
        console.log(profile);

        try {
            const user = await UserModel.findOne({email: profile._json.email})
            if(user) return done(null, user)

            const newUser = await UserModel.create({
                first_name: profile._json.name,
                last_name: "",
                email: profile._json.email,
                password: ""
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