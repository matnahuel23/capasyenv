const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, ref: 'User' }
},{ versionKey: false })

const ticketModel = mongoose.model('Ticket', ticketSchema)

module.exports = ticketModel