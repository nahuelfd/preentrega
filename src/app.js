import express from 'express'
import productRouter from './routers/products.router.js'
import cartRouter from './routers/cart.router.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routers/views.router.js'


const app = express()
app.use(express.json())
//app.use(express.urlencoded({extended: true}))

//incializar el motor de plantilla
app.engine('handlebars', handlebars.engine())
// indicamos donde estan las vistas:
app.set('views', 'src/views')
// indicamos que motor de plantilla usar:
app.set('view engine', 'handlebars')

app.use('/handlebars', viewsRouter)
    
    


app.use('/static', express.static('public'))
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

app.use('/', (req, res) => res.send('HOME'))




const server = app.listen(8080)
server.on('error', () => console.log('ERROR'))