## COINBASE API PAYMENTS PROCESSOR WITH NODEJS.

> Dependencies Install
- npm install

## ENVIRONMENT VARIABLES -> file in root .env

- COINBASE_API_KEY=<--- Binance API KEY --->
- COINBASE_WEBHOOK_SECRET=<--- Webhook Secret --->
- DOMAIN=https://domain.xx
- PORT=3003

## ROUTES

> Create Payment.
- /create-charge

> Send Payment.
- /payment-handler

> Get Success Payment.
- /success-payment

> Get Cancel Payment.
- /cancel-payment