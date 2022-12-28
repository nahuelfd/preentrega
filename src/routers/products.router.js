import { Router } from 'express'
import FileManager from '../manager/file_manager.js'




const fileManager = new FileManager('products.json')
const router = Router()




router.get('/', async (req, res) => {
    const products = await fileManager.get()
    res.json({ products })
})

router.get('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const productToUpdate = req.body

    const product = await fileManager.getByID(id)
    if(!product) return res.status(404).send('Product not found')

    for (const key of Object.keys(productToUpdate)) {
        product[key] = productToUpdate[key]
    }

    await fileManager.getByID(id)

    res.json({ product })
})

router.post('/', async (req, res) => {
    const product = req.body
    const productAdded = await fileManager.add(product)

    res.json({status: "success", productAdded })
})

router.put('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const productToUpdate = req.body

    const product = await fileManager.getByID(id)
    if(!product) return res.status(404).send('Product not found')

    for (const key of Object.keys(productToUpdate)) {
        product[key] = productToUpdate[key]
    }

    await fileManager.update(id, product)

    res.json({status: "success", product })
})

router.delete('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const removeP = req.body

    const product = await fileManager.getByID(id)
    if(!product) return res.status(404).send('Product not found')

    for (const key of Object.keys(removeP)) {
        product[key] = removeP[key]
    }

    await fileManager.removeProduct(id, product)

    res.json({status: "success", message: "product deleted" })
})

router.get('/productsHand', async (req, res) => {
    const products = await fileManager.get()
    const list = await this.read()

    res.render('index', {list})
})

export default router