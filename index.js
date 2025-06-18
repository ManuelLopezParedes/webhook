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
    try {
        console.log("Webhook recibido de OpenPay:", req.body)
        
        // Verificar que la solicitud viene de OpenPay
        // (Implementa verificación de firma si es necesario)
        
        const eventType = req.body.type;
        const paymentData = req.body.transaction;
        
        if (eventType === 'charge.succeeded') {
            const webhookData = {
                body: req.body,
                headers: req.headers,
                query: req.query,
                fechaDeRegistro: new Date(),
                status: 'success',
                paymentId: paymentData.id,
                amount: paymentData.amount,
                currency: paymentData.currency,
                customer: paymentData.customer
            }
            
            await agregarAsync(webhookData);
            
            // Aquí puedes agregar lógica adicional para actualizar tu base de datos principal
            // con la información del pago
            
            return res.status(200).json({ received: true });
        }
        
        res.status(200).json({ received: true, message: 'Evento no manejado' });
    } catch (error) {
        console.error("Error al procesar webhook:", error);
        res.status(500).json({ error: error.message });
    }
})

app.listen(3000, () => {
    console.log("http://localhost:3000")
})