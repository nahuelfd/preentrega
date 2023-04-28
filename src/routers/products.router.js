import {Router} from "express"
import { ProductService } from "../repository/index.js"
import { generateProduct } from '../utils.js'
import { addLogger } from "../logger.js"

const router = Router()
router.use(addLogger)

router.get("/", async (req, res) => {
    const products = await ProductService.get()
    const limit = req.query.limit || 5
    
    res.json(products.slice(0, parseInt(limit)))
    
})


router.get("/view", async (req, res) => {
    const products = await ProductService.get()
    res.render('realTimeProducts', {
        data: products
    })
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    const product = await productModel.findOne({_id: id})
    res.json({
        product
    })
})

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid
    const productDeleted = await productModel.deleteOne({_id: id})

    req.io.emit('updatedProducts', await ProductService.get());
    res.json({
        status: "Success",
        massage: "Product Deleted!",
        productDeleted
    })
})

router.post("/", async (req, res) => {
    try {
        const product = req.body
        
        const productAdded = await ProductService.create(product)
        //req.io.emit('updatedProducts', await ProductService.get());
        res.json({
            status: "Success",
            productAdded
        })
    } catch (error) {
        req.logger.error(error)
        res.json({
            error
        })
    }
})

router.post("/mockingproducts", async(req, res) => {
    const products = []

    for (let i = 0; i < 100; i++) {
        products.push( generateProduct() )
    }

    res.send({status: "success", payload: products })
})

router.put("/:pid", async (req, res) => {
    const id = req.params.pid
    const productToUpdate = req.body

    const product = await productModel.updateOne({
        _id: id
    }, productToUpdate)
    req.io.emit('updatedProducts', await ProductService.get());
    res.json({
        status: "Success",
        product
    })
})



export default router