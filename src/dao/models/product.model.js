import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productCollection = "productos"

const productSchema = new mongoose.Schema({
    title:{ type: String, required: true, max:100 },
    description:{ type: String, required: true, max:200 },
    code:{ type: Number, required: true},
    price:{ type: Number, required: true },
    status:{ type: Boolean, required: true },
    stock:{ type: Number, required: true},
    category:{ type: String, enum: ["gaseosa", "vino", "cerveza"], default: "gaseosa", required: true },
    thumbnails:{ type: Array, required: false},
},{ versionKey: false });

// Aplica el plugin de paginación al modelo de productos
productSchema.plugin(paginate);

const productModel = mongoose.model(productCollection, productSchema)

export default productModel