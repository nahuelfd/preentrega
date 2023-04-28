import {Router} from "express"
import { ProductService } from "../repository/index.js"
import { addLogger } from "../logger.js"

const router = Router()

router.use(addLogger)

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
    
    const data = await ProductService.getPaginate(search, options)
    req.logger.info(JSON.stringify(data, null, 2, '\t'));

    const user = req.session.user
    
    const front_pagination = []
    for (let i = 1; i <= data.totalPages; i++) {
        front_pagination.push({
            page: i,
            active: i == data.page
        })
    }

    res.render('products', { data, user, front_pagination })
})

export default router