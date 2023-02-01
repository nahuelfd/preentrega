import express from 'express'

import { Server } from 'socket.io'
import __dirname from './utils.js'
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'

import run from './run.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(__dirname + "/public"))
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

//app.use('/api/products', productRouter)
//app.use('/api/carts', cartRouter)

//app.use("/products", productViewsRouter)
//app.use("/api/products", productRouter)
//app.use("/api/carts", cartRouter)

//app.use('/', (req, res) => res.send('HOME'))

mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName: "projectBE"
}, (error) => {
    if(error){
        console.log("DB No conected...")
        return
    }
    const httpServer = app.listen(8080, () => console.log("listening"))
    const socketServer = new Server(httpServer)
    httpServer.on("error", (e) => console.log("error: " + e))

    run(socketServer, app)
})




//const server = app.listen(8080)
//server.on('error', () => console.log('ERROR'))