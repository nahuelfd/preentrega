import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io';
import run from './run.js'
import passport from 'passport'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import initializePassport from './config/passport.config.js'
import cookieParser from "cookie-parser"
import __dirname from './utils.js'
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import config from "./config/config.js"

const app = express()

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Documentacion",
            description: "Proyecto backend"
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve , swaggerUiExpress.setup(specs))


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
    const PORT = process.env.PORT || 8080
    const connection = mongoose.connect(process.env.MONGO_URI)
    const httpServer = app.listen(PORT, () => console.log("listening"))
    const socketServer = new Server(httpServer)
    httpServer.on("error", (e) => console.log("error: " + e))

    run(socketServer, app)





//const server = app.listen(8080)
//server.on('error', () => console.log('ERROR'))