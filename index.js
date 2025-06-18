const express = require('express')
const { agregarAsync, obtenerTodoAsync } = require("./webhook.repositorio")

app = express()

app.use(express.json())

// endpoint "/api/"
app.get("/", (req, res) => {
    const data = {
        mensaje: "hola mundo"
    }
    res.status(200).json(data)
})

app.post("/api/webhook", async (req, res) => {
    console.log("Datos recibidos:", req.body);

    // 1. Verificación inicial de OpenPay (handshake)
    if (req.body.type === 'verification') {
        console.log("OpenPay verificando el webhook...");
        return res.status(200).json({ 
            challenge: req.body.challenge  // ¡OpenPay espera este campo!
        });
    }

    // 2. Evento real (ej: pago exitoso)
    if (req.body.type === 'charge.succeeded') {
        const webhookData = {
            body: req.body,
            headers: req.headers,
            fechaDeRegistro: new Date(),
            paymentId: req.body.transaction.id
        };
        await agregarAsync(webhookData);
        return res.status(200).json({ success: true });
    }

    // 3. Otros eventos no manejados
    res.status(200).end();
});

app.listen(3000, () => {
    console.log("http://localhost:3000")
})