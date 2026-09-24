//JIRETH PALACIOS 
//PRÁCTICA 3

const express = require('express');
const crypto = require('crypto'); // Viene por defecto en Node.js para SHA-256
const app = express();

// Middleware para leer JSON en el body de las peticiones POST
app.use(express.json());

// 1. Endpoint: /mascaracaracteres (nota: lleva 'a' intermitente según tus evidencias)
app.post('/mascaracaracteres', (req, res) => {
    const { cad1, cad2 } = req.body;
    if (!cad1 || !cad2) {
        return res.status(400).json({ ok: false, mensaje: "Faltan parámetros 'cad1' o 'cad2'" });
    }
    const resultado = cad1.length >= cad2.length ? cad1 : cad2;
    res.json({ ok: true, resultado: resultado });
});

// 2. Endpoint: /menoscaracteres
app.post('/menoscaracteres', (req, res) => {
    const { cad1, cad2 } = req.body;
    if (!cad1 || !cad2) {
        return res.status(400).json({ ok: false, mensaje: "Faltan parámetros 'cad1' o 'cad2'" });
    }
    const resultado = cad1.length <= cad2.length ? cad1 : cad2;
    res.json({ ok: true, resultado: resultado });
});

// 3. Endpoint: /numcaracteres
app.post('/numcaracteres', (req, res) => {
    const { cadena } = req.body;
    if (!cadena) {
        return res.status(400).json({ ok: false, mensaje: "Falta el parámetro 'cadena'" });
    }
    res.json({ ok: true, resultado: cadena.length });
});

// 4. Endpoint: /palindroma
app.post('/palindroma', (req, res) => {
    const { cadena } = req.body;
    if (!cadena) {
        return res.status(400).json({ ok: false, mensaje: "Falta el parámetro 'cadena'" });
    }
    // Limpiar espacios y pasar a minúsculas para evaluar correctamente el palíndromo
    const limpia = cadena.toLowerCase().replace(/[\W_]/g, '');
    const alReves = limpia.split('').reverse().join('');
    const esPalindroma = limpia === alReves;
    
    res.json({ ok: true, resultado: esPalindroma });
});

// 5. Endpoint: /concat
app.post('/concat', (req, res) => {
    const { cad1, cad2 } = req.body;
    if (!cad1 || !cad2) {
        return res.status(400).json({ ok: false, mensaje: "Faltan parámetros 'cad1' o 'cad2'" });
    }
    res.json({ ok: true, resultado: cad1 + cad2 });
});

// 6. Endpoint: /applysha256
app.post('/applysha256', (req, res) => {
    const { cadena } = req.body;
    if (!cadena) {
        return res.status(400).json({ ok: false, mensaje: "Falta el parámetro 'cadena'" });
    }
    const hash = crypto.createHash('sha256').update(cadena).digest('hex');
    res.json({ 
        ok: true, 
        resultado: {
            cadena: cadena,
            sha256: hash
        } 
    });
});

// 7. Endpoint: /verifysha256
app.post('/verifysha256', (req, res) => {
    const { cadena, hash } = req.body;
    if (!cadena || !hash) {
        return res.status(400).json({ ok: false, mensaje: "Faltan parámetros 'cadena' o 'hash'" });
    }
    const hashCalculado = crypto.createHash('sha256').update(cadena).digest('hex');
    const coincide = hashCalculado === hash;
    res.json({ ok: true, resultado: coincide });
});

// Iniciar el servidor en el puerto 3000 (Siempre hasta abajo)
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});