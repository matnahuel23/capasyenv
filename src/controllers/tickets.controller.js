const Ticket = require ("../dao/classes/ticket.dao.js")
const usersService = require ("../dao/factory/user.factory.js")
const cartsService = require("../dao/factory/cart.factory.js")
const path = require ("path")
const ticketService = new Ticket();

getTicket = async (req, res) => {
    try {
        const products = await ticketService.getTicket()
/*         const viewPath = path.join(__dirname, '../views/products.hbs');
        const { first_name, email, age, cart } = req.session.user;
        res.render(viewPath, { products, first_name, email, age, cart}) */
    } catch (error) {
        res.status(500).send({ status: "error", error: 'Error al mostrar el ticket. Detalles: ' + error.message });
    }
}
getTicketById = async (req, res) => {
    const { tid } = req.params
    let result = await ticketService.getTicketById(tid)
    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })
    res.send({ status: "success", result: result })
}
createTicket = async (req, res) => {
    try {
        let { title, description, code, price, stock, category } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).send({ status: "error", error: 'Todos los campos obligatorios deben ser proporcionados.' });
        }
        // Agregar el producto en la base de datos
        let result = await ticketService.createTicket({
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category
        });
        res.send({ result: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: 'Error al agregar el producto. Detalles: ' + error.message });
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
        let result = await productsTicket.updateTicket(pid, ticketToReplace);
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
        let result = await ticketService.deleteTicket({_id: tid})
        res.send({ result: "success", message: 'Ticket eliminado correctamente.', payload: result })      
    } catch (error) {
        res.send({ status: "error", error: 'Error al eliminar el ticket.' });
    }
}

module.exports = {
    getTicket,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
  };