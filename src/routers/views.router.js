import express from 'express'
import FileManager from '../manager/file_manager.js'



const fileManager = new FileManager('products.json')
const router = express.Router()

router.get('/products', async (req, res) => {
    const list = await fileManager.get()
    const products = JSON.stringify(list)

    res.render('index', {products})
})

export default router

