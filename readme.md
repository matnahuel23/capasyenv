Para poder ver todos los docs correctamente hay que estar logueado previamente en
http://localhost:8080

user: user@test.com
password: 1

DOCS
http://localhost:8080/apidocs/

ADMIN
user: adminCoder@coder.com 
password: 1

Desarrollo carga documentos

![last connection](src/public/prints/1-last_connection.png)

![elijo opcion cargar documentos](src/public/prints/2-opcion_documentos.png)

![cargo 1 documento](src/public/prints/3-carga_documentos.png)

![no hay carpeta para los documentos](src/public/prints/4-archivos%20antes%20de%20cargar%20doc.png)

![agrego un documento OK](src/public/prints/5-cargo%20un%20archivo%20OK.png)

![se crea sola la carpeta para documentos](src/public/prints/6-archivos%20post%20carga%20crea%20carpeta%20sino%20existe.png)

![se carga en MONGO](src/public/prints/7-carga%20ok%20de%20doc%20en%20mongo%20con%20name%20y%20reference.png)

![condiciones insuficientes para Ser Premium](src/public/prints/8-condicion%20insuficiente%20para%20Ser%20Premium.png)

![cumple condicion de 3 documentos distintos](src/public/prints/9-condicion%20Ok%20necesario%203%20documentos%20distintos%20cargados.png)

![se actualiza MONGO con nuevo rol](src/public/prints/10-user%20premium%20ahora%20en%20mongo%20OK.png)