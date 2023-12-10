/*SUPERTEST
*   tengo que ejecutar npm start en una terminal y esperar a que node abra OK
*   abro otra terminar y ejecuto npm test
*/ 
const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;
const requester = supertest("http://localhost:8080");

//Hace falta ingresa la cookie de la session ACTUAL
const sessionCookie = 's%3AKOJ_ihOKKT62VCdGbC9fboU1mdSUTzk1.jAwmqsp%2FoI0L0mw%2FcL6VlDBTxMbruEf9zkjAqMdsHDw'; 

describe("Testing SuperTest", () => {
    describe("Test de productos", () => {
        it("El endpoint POST /products debe crear un producto correctamente", async () => {
            const productMock = {
                "title": "Producto X",
                "description": "Producto de Prueba",
                "code": 1,
                "price": 10,
                "status": true,
                "stock": 100,
                "category": "gaseosa"
            }

            const {
                statusCode,
                ok,
                _body
            } = await requester
                .post('/products')
                .set('Cookie', [`connect.sid=${sessionCookie}`]) // Establece la cookie de sesión
                .send(productMock);

            expect(_body.payload).to.have.property("_id")
        });
    });
});
