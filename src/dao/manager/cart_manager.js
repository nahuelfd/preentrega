import fs from 'fs'

class CartManager {

    constructor(path){
        this.path = path
    }
    read = () => {
        if (fs.existsSync(this.path)) {
            return fs.promises.readFile(this.path, 'utf-8').then(r => JSON.parse(r))
        }

        return []
    }

    getNextID = list => {
        const count = list.length
        return (count > 0) ? list[count-1].id +1 : 1

    }

    write = list => {
        return fs.promises.writeFile(this.path, JSON.stringify(list))
    }

    getByID = async (id) => {
        const data = await this.read()

        return data.find(p => p.id == id)
    }

    get = async () => {
        return await this.read()
    }

    create = async () => {
        //if (!this.checkProductoValido(prod)) {
         //   console.log("Producto no valido")
        //    return false
        //}
    
        const carts = await this.read()
        const nextID = this.getNextID(carts)
        
        const newCart = {
            id: nextID,
            products: []
        }
        
    
        carts.push(newCart)
        
        await this.write(carts)

        return newCart 
    }

    update = async (id, prod) => {
        //if (!checkProductoValido(prod)) {
        //    console.log("Producto no valido")
       //     return false
       // }

        const productList = await this.read()
        const index = productList.findIndex(element => element.id === id)
        if (index < 0) return false

        prod.id = id
        productList[index] = prod

        await this.write(productList)
        return true
    }
    addProduct = async (cartID, productID) => {
        
        const cart = await this.getByID(cartID)

        let found = false
        for (let i = 0; i < cart.products.length; i++) {
            if(cart.products[i].id == productID) {

                cart.products[i].quantity++

                found = true
                break
            }
        }

        if(!found) {
            cart.products.push({ id: productID, quantity: 1 })
        }

        await this.update(cartID, cart)

        return cart
    }

    checkProductoValido = (product) => {
        const { title, description, price, thumbnail, code, stock} = product

        // Verificar que estan todos los campos y code > 0
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("falta uno o mas parametros");
            return false
        }
        return true;
    }

    removeProduct = async (id) => {
        const productList = await this.getProducts()
        const index = productList.findIndex(element => element.id === id)
        if (index < 0) return false

        productList.splice(index, 1)
        await this.write(productList)
        return true

    }
}

export default CartManager
