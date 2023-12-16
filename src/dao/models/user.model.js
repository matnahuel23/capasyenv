const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const documentSchema = new mongoose.Schema({
  name: { type: String },
  reference: { type: String }
}, { _id: false });

const userSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  age: { type: Number },
  role: { type: String, enum: ["user", "admin", "premium"], default: "user" },
  password: { type: String },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrito' },
  documents: { type: [documentSchema], default: [] }, // arreglo de documentos
  last_connection: { type: Date }
}, { versionKey: false });

userSchema.plugin(paginate);

const userModel = mongoose.model('Usuario', userSchema);

module.exports = userModel;
