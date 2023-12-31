import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const userSchema = new mongoose.Schema({
    first_name:{type: String},
    last_name: {type: String},
    email: {type: String},
    age: {type: Number},
    role:{ type: String, enum: ["user", "admin"], default: "user"},
    password: { type: String }, 
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrito' }
},{ versionKey: false });

userSchema.plugin(paginate);

const userModel = mongoose.model('Usuario', userSchema);

export default userModel