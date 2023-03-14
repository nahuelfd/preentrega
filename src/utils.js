import {fileURLToPath} from 'url'
import { dirname } from 'path'
import jwt from 'jsonwebtoken'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const JWT_PRIVATE_KEY = "LlavePrivad asdasd123"

export default __dirname

export const generateToken = user => {
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: '24h'})

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


