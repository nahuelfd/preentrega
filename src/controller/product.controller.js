import ProductService from "../services/product.service.js";

const productService = new ProductService()

//GET
export const getAll = async (req, res) => {
    const products = await productService.getAll()
    const limit = req.query.limit
    if (limit) {
        res.json(products.slice(0, parseInt(limit)))
    } else {
        res.render("list", {
            products
        })
    }
}



export const getById = async (req, res) => {
    const id = req.params.id
    const product = await productService.getById(id)
    res.render("dProduct", product)
}

