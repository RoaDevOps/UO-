const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Le dice a Express que sirva todo lo que está en la carpeta "public"
app.use(express.static('public'));

// Permite que el servidor entienda datos enviados en formato JSON
app.use(express.json());

// Ruta donde llegará el formulario de contacto
app.post('/api/contacto', (req, res) => {
    const { nombre, telefono, mensaje } = req.body;

    if (!nombre || !telefono) {
        return res.status(400).json({ ok: false, error: 'Faltan datos obligatorios.' });
    }

    const registro = {
        fecha: new Date().toLocaleString('es-MX'),
        nombre,
        telefono,
        mensaje: mensaje || '(sin mensaje)'
    };

    const linea = JSON.stringify(registro) + '\n';
    const archivo = path.join(__dirname, 'data', 'contactos.jsonl');

    // Crea la carpeta "data" si no existe
    if (!fs.existsSync(path.join(__dirname, 'data'))) {
        fs.mkdirSync(path.join(__dirname, 'data'));
    }

    // Agrega el nuevo contacto al final del archivo
    fs.appendFile(archivo, linea, (err) => {
        if (err) {
            console.error('Error guardando el contacto:', err);
            return res.status(500).json({ ok: false, error: 'No se pudo guardar.' });
        }
        console.log('✅ Nuevo contacto guardado:', nombre);
        res.json({ ok: true, mensaje: 'Gracias, nos pondremos en contacto pronto.' });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});