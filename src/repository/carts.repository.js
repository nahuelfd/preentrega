import CartDTO from '../dao/DTO/carts.dto.js'

export default class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    get = async() => {
        return await this.dao.get()
    }


    getByID = async (id) => {
        return await this.dao.getByID(id)
    }

    create = async(data) => {
        const dataToInsert = new CartDTO(data)

        return await this.dao.add(dataToInsert)
    }
}