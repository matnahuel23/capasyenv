const ticketsService = require ("../dao/factory/ticket.factory.js")
const cartsService = require ("../dao/factory/cart.factory.js")
const usersService = require ("../dao/factory/user.factory.js")
const path = require ("path");
const TicketDTO = require ('../dao/DTOs/ticket.DTO.js')

function generateRandomAlphaNumeric(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

getTickets = async (req, res) => {
    try {
        const { email, cart } = req.session.user;
        const result = await cartsService.getCartById(cart)
        const viewPath = path.join(__dirname, '../views/ticket.hbs');
        res.render(viewPath, { email, result, cart});
    } catch (error) {
        res.send({status:"error", error: 'Error al obtener el ticket.' });
    }
}
getTicketById = async (req, res) => {
    try {
        let { tid } = req.params;
        let ticket = await ticketsService.getTicketById(tid)
        if (!ticket) {
            res.send({ status: "error", error: 'Ticket no encontrado.' });
        } else {
            const viewPath = path.join(__dirname, '../views/ticket.hbs');
            const { first_name, email, age } = req.session.user;   
            res.render(viewPath, { cart, first_name, email, age });
        }
    } catch (error) {
        res.send({ status: "error", error: 'Error al obtener el ticket.' });
    }
}
createTicket = async (req, res) => {
    try {
        let { phone } = req.body;
        const { email, cart, _id } = req.session.user;
        if (!phone) {
            return res.status(400).send({ status: "error", error: 'Todos los campos obligatorios deben ser proporcionados.' });
        }
        const result = await cartsService.getCartById(cart);
        let code = generateRandomAlphaNumeric(10);
        let newTicket = new TicketDTO({ code, phone, email, cart: result , total: result.total});
        await ticketsService.createTicket(newTicket);
        // Crear un nuevo carrito
        let newCart = await cartsService.createCart();
        // Actualizar el campo "cart" del usuario con el ID del nuevo carrito
        await usersService.updateUser(_id, { cart: newCart._id });
        const message = "Su compra se realizó correctamente. Número de código: " + code;
        res.status(200).json({ result: "success", message });
    } catch (error) {
        console.log("Error al generar el Ticket:", error);
        res.status(500).send({ status: "error", error: 'Error al generar el Ticket. Detalles: ' + error.message });
    }
}
updateTicket = async (req, res) => {
    try {
        let { tid } = req.params;
        const ticketToReplace = req.body;
        // Validamos que se proporcionen campos para actualizar
        if (Object.keys(ticketToReplace).length === 0) {
            return res.send({ status: "error", error: 'Debe proporcionar al menos un campo para actualizar.' });
        }
        let result = await ticketsService.updateTicket(tid, ticketToReplace);
        if (!result) {
            return res.send({ status: "error", error: 'Producto no encontrado.' });
        }
        // Actualizamos los campos del producto encontrado
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error(`Error: ${error}`);
        res.send({ status: "error", error: 'Error al actualizar el ticket.' });
    }
}
deleteTicket = async (req, res) => {
    try {
        let {tid} = req.params;
        let result = await ticketsService.deleteTicket({_id: tid})
        res.send({ result: "success", message: 'Ticket eliminado correctamente.', payload: result })      
    } catch (error) {
        res.send({ status: "error", error: 'Error al eliminar el ticket.' });
    }
}

module.exports = {
    getTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
  };