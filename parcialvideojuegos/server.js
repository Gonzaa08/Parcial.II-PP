// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

// Conectar con la base de datos juegodb
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       
    password: '', 
    database: 'juegodb'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    return;
}
    console.log('Conectado a la base de datos juegodb');
});


app.get('/juegos', (req, res) => {
    const year = req.query.year;
    const query = year && year !== 'todos'
        ? 'SELECT * FROM juegos WHERE year = ?'
        : 'SELECT * FROM juegos';

db.query(query, [year], (err, results) => {
    if (err) {
        res.status(500).send('Error en la consulta de la base de datos');
        return;
    }
    res.json(results);
});
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
