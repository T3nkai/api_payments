const { check, validationResult } = require('express-validator');
const logger = require('../services/logger');

const paymentBase = (app) => {
    let connection = app.persistence.connectionFactory();
    let paymentDao = new app.persistence.PaymentDao(connection);
    return paymentDao
};

const clientBase = (app) => {
    let customerCards = new app.services.customerCards();
    return customerCards
};

const ROUTE = process.env.ROUTE + ':' + process.env.PORT;

const PAYMENT_TYPE_PAYFAST = 'payfast';
const PAYMENT_TYPE_CARD = 'cartao';

const PAYMENT_CREATED = "CRIADO";
const PAYMENT_CONFIRMED = "CONFIRMADO";
const PAYMENT_CANCELED = "CANCELADO";



module.exports = app => {

    app.get('/payments', (req, res) => {


        let paymentDao = paymentBase(app);


        paymentDao.list((error, success) => {
            res.json(success)
            return;
        });
    });

    app.get('/payments/payment/:id', (req, res) => {
        let payment = undefined;
        let paymentId = req.params.id;

        console.log('consulting payment ' + paymentId);
        logger.info('consulting payment ' + paymentId);


        let memcachedClient = new app.services.memcachedClient();

        memcachedClient.get('payment-' + paymentId, function (error, data) {
            if (error || !data) {

                let paymentDao = paymentBase(app);


                paymentDao.seachById(paymentId, (error, success) => {
                    if (error) {
                        console.log('an error occurred when consulting the payment');
                        logger.info('an error occurred when consulting the payment');

                        req.status(500).json(error);
                        return;
                    }
                    console.log('payment successfully consulted');
                    logger.info('payment successfully consulted');

                    res.status(200).send(success);
                    return;

                })
            } else {

                console.log('HIT - value: ' + JSON.stringify(data));
                payment = data;

                logger.info('HIT - value: ' + JSON.stringify(payment));
                res.status(200).send(data);
                return;
            }
        });
        return;
    });

    app.put('/payments/payment/:id', (req, res) => {
        let payment = {};
        let paymentId = req.params.id;
        let paymentDao = paymentBase(app);

        payment.id = paymentId;
        payment.status = PAYMENT_CONFIRMED;

        logger.info('payment confirmed - value: ' + JSON.stringify(payment));

        paymentDao.update(payment, (error) => {
            if (error) {
                console.log('an error occurred while confirming the payment');
                logger.info('an error occurred while confirming the payment');
                req.status(500).json(error);
                return;
            }
            console.log('payment confirmed');
            logger.info('payment confirmed');

            res.status(201).send(payment);
            return;

        })

    });

    app.delete('/payments/payment/:id', (req, res) => {
        let payment = {};
        let paymentId = req.params.id;
        let paymentDao = paymentBase(app);

        payment.id = paymentId;
        payment.status = PAYMENT_CANCELED;

        logger.info('payment canceled - value: '+JSON.stringify(payment));


        paymentDao.update(payment, (error) => {
            if (error) {
                console.log('an error occurred while canceling payment');
                logger.info('an error occurred while canceling payment');

                req.status(500).json(error);
                return;
            }
            console.log('payment canceled successfully');
            logger.info('payment canceled successfully');

            res.status(204).send(payment)
            return;
        })

    });

    app.post('/payments/payment', [
        check("payment.form_of_payment", 'payment method is mandatory').not().isEmpty(),
        check("payment.value", 'value not informed and must be a decimal value').not().isEmpty().isFloat(),
        check("payment.currency", 'Currency not reported').not().isEmpty(),
        check("payment.description", "description not informed").not().isEmpty(),
    ], (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json(errors)
            return;
        }

        let { payment, card } = req.body;




        console.log("processing a request for a new payment");
        logger.info("processing a request for a new payment")

        payment.status = PAYMENT_CREATED;
        payment.date = new Date;


        let paymentDao = paymentBase(app);

        paymentDao.save(payment, (error, success) => {

            console.log('payment being created.....');
            logger.info('payment being created.....');

            if (error) {
                console.log('there was an error saving your payment.....');

                console.log('Error: ' + error);
                logger.info('Error: ' + error);
                
                res.status(500).json(error)
                return;
            }

            let memcachedClient = new app.services.memcachedClient();
            memcachedClient.set('payment-' + payment.id,
                payment
                , 60000, function (error, data) {
                    if (error) {
                        console.log(error)
                        logger.info('Error: ' + JSON.stringify(error));

                        return;
                    }
                    
                    logger.info('payment saved in cache');

                    return;
                });

            if (payment.form_of_payment == PAYMENT_TYPE_CARD) {
                if (card == undefined) {
                    res.status(500).json('card undefyned')
                    return;
                }

                let clientCard = clientBase(app);
                clientCard.authorize(card, (errCard, requestCard, responseCard, objCard) => {

                    if (errCard) {
                        console.log(errCard)
                        let { body } = errCard;
                        res.status(400).send(body);
                        return;
                    }
                    res.location('/payments/payment/' + success.insertId)
                    payment = { ...payment, id: success.insertId };

                    let response = {
                        payment,
                        card: objCard,
                        routes: [
                            {
                                href: ROUTE + '/payments/payment/' + payment.id,
                                rel: PAYMENT_CONFIRMED,
                                method: "PUT"
                            },
                            {
                                href: ROUTE + '/payments/payment/' + payment.id,
                                rel: PAYMENT_CANCELED,
                                method: "DELETE"
                            },
                        ]
                    }



                    res.status(201).json(response)
                    return;
                });


                return;
            }


            console.log('payment successfully generated...')
            res.location('/payments/payment/' + success.insertId)

            payment = { ...payment, id: success.insertId };



            let response = {
                payment,
                routes: [
                    {
                        href: ROUTE + '/payments/payment/' + payment.id,
                        rel: PAYMENT_CONFIRMED,
                        method: "PUT"
                    },
                    {
                        href: ROUTE + '/payments/payment/' + payment.id,
                        rel: PAYMENT_CANCELED,
                        method: "DELETE"
                    },
                ]
            }
            res.status(201).json(response)
            return;
        });
    });
}