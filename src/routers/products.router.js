import {Router} from "express"
import { ProductService } from "../repository/index.js"

const router = Router()

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
        console.log(error)
        res.json({
            error
        })
    }
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