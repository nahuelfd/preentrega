import express from 'express';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import passport from 'passport'
import cookieParser from "cookie-parser"
import session from 'express-session';
import MongoStore from 'connect-mongo';
import initializePassport from './config/passport.config.js'
import __dirname from './utils.js'
import run from './run.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(__dirname + "/public"))
app.use(cookieParser())
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")




app.use(session({
   
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//app.use('/api/products', productRouter)
//app.use('/api/carts', cartRouter)

//app.use("/products", productViewsRouter)
//app.use("/api/products", productRouter)
//app.use("/api/carts", cartRouter)

//app.use('/', (req, res) => res.send('HOME'))


    const httpServer = app.listen(8080, () => console.log("listening"))
    const socketServer = new Server(httpServer)
    httpServer.on("error", (e) => console.log("error: " + e))

    run(socketServer, app)





//const server = app.listen(8080)
//server.on('error', () => console.log('ERROR'))