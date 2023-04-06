import productRouter from "./routers/products.router.js"
import cartRouter from "./routers/cart.router.js"
import { MessageService } from "./repository/index.js"
import productViewsRouter from "./routers/products.views.router.js"
import sessionRouter from './routers/session.router.js'
import { addLogger } from './logger.js'


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
    app.use(addLogger)
    
    app.get('/logger', (req, res) => {
        req.logger.fatal('Advertencia')
        res.send({message: 'logger test'})
    })
    app.get('/loggerTest', (req, res) => {
        req.logger.error('server has fallen')
        req.logger.warning('just a warning')
        req.logger.info('url info')
        req.logger.debug('1 + 1 === 2 ??')

        res.send({message: 'hello loggertest'})
    })
    
    
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