const mongoose = require('mongoose')
const paginate = require ("mongoose-paginate-v2")

const ticketSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, ref: 'User' } // Se refiere al modelo User
},{ versionKey: false })

ticketSchema.plugin(paginate)

const Ticket = mongoose.model('Ticket', ticketSchema)

module.exports = Ticket