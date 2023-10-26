const ticketModel = require ('../models/ticket.model.js')
const fs = require('fs');
const path = require('path');
function generateUniqueId() {
    return Date.now().toString();
}

module.exports =  class Ticket {
    constructor() {
        this.data = []
    }
    
    getTicket = async () => {
        
    }

    getTicketById = async (tid) => {
        
    }

    createTicket = async (ticket) => {
        
    }

    updateTicket = async (tid, ticket) => {
        
    }

    deleteTicket = async (tid) => {
        
    }
}