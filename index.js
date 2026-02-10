var express = require('express');
var app = express(); //Contenedor de Endpoints o WS Restful

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async function (request, response) {

    r ={
      'message':'Nothing to send'
    };

    response.json(r);
});

app.get("/aleatorio", async function (request, response) {
    const numero=Math.floor(Math.random()*100)+1
    r ={
      'numero':numero
    };

    response.json(r);
});
app.listen(3000, function() {
    console.log('Aplicación ejemplo, escuchando el puerto 3000!');
});
