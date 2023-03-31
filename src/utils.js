import {fileURLToPath} from 'url'
import { dirname } from 'path'
import jwt from 'jsonwebtoken'
import passport from 'passport'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import config from './config/config.js'


export default __dirname

export const generateToken = user => {
    const token = jwt.sign({user}, config.jwtPrivateKey, {expiresIn: '24h'})

    return token
}

export const authToken = (req, res, next) => {
    const token = req.headers.auth

    if(!token) return res.status(401).send({error: "not auth"})

    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if(error) return res.status(403).send({error: " not authorized"})

        req.user = credentials.user
        next()
    })

    
}

export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies[config.jwtCookieName] : null
}

export const passportCall = (strategy) =>  {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info){
            if(err) return next(err)
            if(!user) return res.status(401).render("errors/base", {error: info.messages ? info.messages : info.toString()})

            req.user = user
            next()
        }) (req, res, next)
    }
}

export const authorization = (role) => {
    return async (req, res, next) => {
        const user = req.user.user;
        if (!user) return res.status(401).send({ error: "Unauthorized" });
        if (user.role != role) return res.status(403).send({ error: 'No Permission' })
        next();
    }

}

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        department: faker.commerce.department(),
        stock: faker.random.numeric(1),
        id: faker.database.mongodbObjectId(),
        image: faker.image.image()
    }
}