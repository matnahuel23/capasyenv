/*SUPERTEST
*   tengo que ejecutar npm start en una terminal y esperar a que node abra OK
*   abro otra terminar y ejecuto npm test
*/ 
const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;
const requester = supertest("http://localhost:8080");

const sessionCookie = 's%3AOtGZ3sXSO0ZxKjGSn1LWJCDtY7NmbwAI.2%2BRF00%2BET6lPdnv8OhoEFcJZmuP%2FfezKwy3hmFbFAkQ';

describe("Testing SuperTest", () => {
    const productMock = {
        "title": "Producto Prueba",
        "description": "Producto de Prueba",
        "code": 1,
        "price": 10,
        "status": true,
        "stock": 100,
        "category": "gaseosa"
    };

    describe("Test de productos", () => {
        it("El endpoint POST /products debe crear un producto correctamente", async () => {
            try {
                const { statusCode, _body } = await requester
                    .post('/products')
                    .set('Cookie', [`connect.sid=${sessionCookie}`])
                    .send(productMock);
                expect(_body.payload).to.have.property("_id");
            } catch (error) {
                console.error("Error during test:", error);
                throw error;
            }
        });

        it("Crear producto con propiedad STATUS", async () => {
            try {
                const { _body } = await requester
                    .post('/products')
                    .set('Cookie', [`connect.sid=${sessionCookie}`])
                    .send(productMock);

                expect(_body.payload).to.have.property("status").to.be.true;
            } catch (error) {
                console.error("Error during test:", error);
                throw error;
            }
        });

        it("Status 400 cuando no existe la propiedad TITLE", async () => {
            const noTitle = {
                //"title": "Producto Prueba",
                "description": "Producto de Prueba",
                "code": 1,
                "price": 10,
                "status": true,
                "stock": 100,
                "category": "gaseosa"
            };
        
            try {
                const { statusCode, _body } = await requester
                    .post('/products')
                    .set('Cookie', [`connect.sid=${sessionCookie}`])
                    .send(noTitle);
        
                expect(statusCode).to.equal(400);
        
                // Solo verificar que el statusCode sea 400, sin verificar el contenido exacto del mensaje de error
            } catch (error) {
                console.error("Error during test:", error);
                throw error;
            }
        });
                    
    });
});
