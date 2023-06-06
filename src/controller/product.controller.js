import ProductService from "../services/product.service.js";
import Mail from "../modules/mail.js"
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

export const deleteProd = async (req, res) => {
    const id = req.params.pid
    const user = req.user.user
    const productID = await productService.getOneByID(id)
    const owner = productID.owner.id
    if(owner == user._id || user.role == "admin"){
        const productDeleted = await productService.delete(id) 
        req.io.emit('updatedProducts', await productService.get());
        if(productID.owner.email != "admin"){
            const mail = new Mail()
            const html = `
            <h1>information</h1>
            
            <p>Your product  ${productID.title} (ID: ${id}) has been deleted</p>
            `
        mail.send(productID.owner.email, "product deleted", html)
        }
        res.json({status: "Success", massage: "Product Deleted!", productDeleted})
}else{
    req.logger.warning("No Owner")
}}

