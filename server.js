const express = require('express');
const Stripe = require('stripe');
const stripe = Stripe('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'); // Coloca aquí tu clave secreta de Stripe

app.post('/create-checkout-session', async (req, res) => {
    const { price } = req.body; // Obtiene el precio enviado desde el frontend
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'mxm',
              product_data: {
                name: 'Piedra',
              },
              unit_amount: price, // Usa el precio recibido
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://35.223.25.187:3000/success.html',
        cancel_url: 'http://35.223.25.187:3000/cancel.html',
      });
  
      res.json({ id: session.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  