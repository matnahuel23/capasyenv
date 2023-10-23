import Products from "../dao/classes/product.dao.js";
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const productsService = new Products();

export const getProducts = async (req, res) => {
    try {
        const { sort, category, status, page, limit } = req.query;
        // Parsea el valor de sort a un número entero
        const priceSort = sort ? parseInt(sort) : 1;
        // Define las condiciones de búsqueda
        const conditions = {};
        // Agrega la condición de filtrado por categoría si se proporciona
        if (category) {
            conditions.category = category;
        }
        // Agrega la condición de filtrado por status si se proporciona
        if (status !== undefined) {
            conditions.status = status === 'true'; // Convierte el valor a booleano
        }
        // Realiza la consulta utilizando paginate()
        const options = {
            page: page || 1, // Página actual
            limit: limit || 10, // Cantidad de resultados por página
            sort: { price: priceSort }, // Ordenar por precio
        }
        const products = await productsService.paginate(conditions, options)
        const viewPath = path.join(__dirname, '../views/products.hbs');
        const { first_name, email, age, cart } = req.session.user;
        res.render(viewPath, { products, first_name, email, age, cart})
    } catch (error) {
        res.status(500).send({ status: "error", error: 'Error al mostrar productos. Detalles: ' + error.message });
    }
}
export const getProductById = async (req, res) => {
    const { pid } = req.params
    let result = await productsService.getProductById(pid)
    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })
    res.send({ status: "success", result: result })
}
export const getProductByTitle = async (req, res) => {
    try {
        let {pid} = req.params;
        let product = await productsService.getProductByTitle(pid)
        if (!product) {
             res.send({status:"error", error: 'Producto no encontrado.' });
        }
        res.send({result:"success", payload:product})
    } catch (error) {
        res.send({status:"error", error: 'Error al obtener el producto.' });
    }
}
export const createProducts = async (req, res) => {
    try {
        let { title, description, code, price, stock, category } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).send({ status: "error", error: 'Todos los campos obligatorios deben ser proporcionados.' });
        }
        const thumbnailFilename = req.file ? req.file.filename : null;
        const thumbnails = thumbnailFilename ? [thumbnailFilename] : [];
        // Agregar el producto en la base de datos
        let result = await productsService.createProduct({
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails
        });
        res.send({ result: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: 'Error al agregar el producto. Detalles: ' + error.message });
    }
}
export const updateProduct = async (req, res) => {
    try {
        let { pid } = req.params;
        const productToReplace = req.body;
        // Validamos que se proporcionen campos para actualizar
        if (Object.keys(productToReplace).length === 0) {
            return res.send({ status: "error", error: 'Debe proporcionar al menos un campo para actualizar.' });
        }
        // Verificamos si el stock es igual a 0 y actualizo el status
        if (productToReplace.stock == "0") {
            productToReplace.status = false;
        } else {
            productToReplace.status = true;
        }
        let result = await productsService.updateProduct(pid, productToReplace);
        if (!result) {
            return res.send({ status: "error", error: 'Producto no encontrado.' });
        }
        // Actualizamos los campos del producto encontrado
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error(`Error: ${error}`);
        res.send({ status: "error", error: 'Error al actualizar el producto.' });
    }
}
export const deleteProduct = async (req, res) => {
    try {
        let {pid} = req.params;
        let result = await productsService.deleteProduct({_id: pid})
        res.send({ result: "success", message: 'Producto eliminado correctamente.', payload: result })      
    } catch (error) {
        res.send({ status: "error", error: 'Error al eliminar el producto.' });
    }
}