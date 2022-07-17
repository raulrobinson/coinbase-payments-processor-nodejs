const express = require("express");

const {
    COINBASE_API_KEY,
    COINBASE_WEBHOOK_SECRET,
    DOMAIN,
    PORT
} = require('./config');

const { Client, resources, Webhook } = require('coinbase-commerce-node');

const morgan = require('morgan')

Client.init(COINBASE_API_KEY);

const { Charge } = resources;

const app = express();

app.use(morgan('dev'));

app.use(
    express.json({
        verify: (req, res, buf) => {
            req.rawBody = buf
        },
    })
);

// Routes.

// Create Payment.
app.get('/create-charge', async (req, res) => {

    const chargeData = {
        'name': 'Sound Effect',
        description: 'An awesome sound',
        local_price: {
            amount: '0.2',
            currency: 'usd'
        },
        pricing_type: 'fixed_price',
        metadata: {
            customer_id: 'id_123',
            customer_name: 'John Doe'
        },
        redirect_url: `${DOMAIN}/success-payment`,
        cancel_url: `${DOMAIN}/cancel-payment`,
    }

    const charge = await Charge.create(chargeData);

    res.send(charge)
})

// Send Payment.
app.post('/payment-handler', (req, res) => {
    const rawBody = req.rawBody
    const signature = req.headers['x-cc-webhook-signature']
    const webhookSecret = COINBASE_WEBHOOK_SECRET

    let event
    
    try {
        event = Webhook.verifyEventBody(rawBody, signature, webhookSecret)

        if (event.type === 'charge:pending') {
            console.log('Charged is pending')
        } 

        if (event.type === 'charge:confirmed') {
            console.log('Charged is confirmed')
        } 

        if (event.type === 'charge:failed') {
            console.log('Charged failed')
        } 

        return res.status(200).send(event.id)

    } catch (error) {
        console.log(error)
        res.status(400).send('failed')
    }
})

// Get Success Payment.
app.get('/success-payment', (req, res) => {
    res.send('Payment Successfull')
})

// Get Cancel Payment.
app.get('/cancel-payment', (req, res) => {
    res.send('Cancel Payment')
})

// Listen Server.
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});