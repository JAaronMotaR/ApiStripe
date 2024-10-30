const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const path = require('path');



const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sirve archivos estáticos desde el directorio actual
app.use(express.static(path.join(__dirname)));

// Endpoint para la ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint para crear una sesión de pago
app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Ejemplo de Producto',
          },
          unit_amount: 2000, // $20.00
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:8080/success.html',
    cancel_url: 'http://localhost:8080/cancel.html',
  });

  res.json({ id: session.id });
});

// Página de éxito
app.get('/success.html', (req, res) => {
  res.send('<h1>¡Pago exitoso!</h1>');
});

// Página de cancelación
app.get('/cancel.html', (req, res) => {
  res.send('<h1>Pago cancelado</h1>');
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
