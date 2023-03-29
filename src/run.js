import productRouter from "./routers/products.router.js"
import cartRouter from "./routers/cart.router.js"
import { MessageService } from "./repository/index.js"
import productViewsRouter from "./routers/products.views.router.js"
import sessionRouter from './routers/session.router.js'


const run = (socketServer, app) => {
    app.use((req, res, next) => {
        req.io = socketServer
        next()
    })
    app.use("/products", productViewsRouter)
    //app.use("/session", sessionRouter)

    app.use("/api/products", productRouter)
    app.use("/api/carts", cartRouter)
    app.use('/api/session', sessionRouter)
    
    socketServer.on("connection", socket => {
        console.log("New client connected")
        socket.on("message", async data => {
        await MessageService.create(data)
        let messages = await MessageService.get()
        socketServer.emit("logs", messages)
        })
    })

    app.use("/", (req, res) => res.send("HOME"))

}

export default run