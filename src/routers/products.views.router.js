import {Router} from "express"
import productModel from "../dao/models/products.model.js"
import mongoosePaginate from 'mongoose-paginate-v2'

const router = Router()

router.get("/", async (req, res) => {

    const limit = req.query?.limit || 5
    const page = req.query?.page || 1
    const filter = req.query?.filter || ''
    const sortQuery = req.query?.sort || ''
    const sortQueryOrder = req.query?.sortorder || 'desc'

    const search = {}
    if(filter) {
        search.title = filter
    }
    const sort = {}
    if (sortQuery) {
        sort[sortQuery] = sortQueryOrder
    }

    const options = {
        limit, 
        page, 
        sort,
        lean: true
    }
    
    const data = await productModel.paginate(search, options)
    console.log(JSON.stringify(data, null, 2, '\t'));

    //const user = req.session.user
    
    res.json({data})
})

export default router