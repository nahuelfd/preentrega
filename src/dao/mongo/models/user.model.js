import mongoose from "mongoose"

const userCollection = "users"

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    first_name: String,
    last_name: String,
    role: { type: String, default: 'user' }
})

mongoose.set("strictQuery", false)
const UserModel = mongoose.model(userCollection, userSchema)

export default UserModel