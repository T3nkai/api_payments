const { check, validationResult } = require('express-validator');

const paymentBase = (app) => {
    let connection = app.persistence.connectionFactory();
    let paymentDao = new app.persistence.PaymentDao(connection);
    return paymentDao
};

module.exports = app => {

    const PAYMENT_CREATED = "CREATED";
    const PAYMENT_CONFIRMED = "CONFIRMED";
    const PAYMENT_CANCELED = "CANCELED";

    app.get('/payments', (req, res) => {


        let paymentDao = paymentBase(app);


        paymentDao.list((error, success) => {
            res.json(success)
            return;
        });
    });

    app.put('/payments/payment/:id', (req, res) => {
        let payment = {};
        let paymentId = req.params.id;
        let paymentDao = paymentBase(app);

        payment.id = paymentId;
        payment.status = PAYMENT_CONFIRMED;

        paymentDao.update(payment, (error) => {
            if (error) {
                console.log('an error occurred while confirming the payment')
                req.status(500).json(error);
                return;
            }
            console.log('payment confirmed')
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

        paymentDao.update(payment, (error) => {
            if (error) {
                console.log('an error occurred while canceling payment')
                req.status(500).json(error);
                return;
            }
            console.log('payment canceled successfully')
            res.status(204).send(payment)
            return;
        })

    });

    app.post('/payments/payment', [
        check("form_of_payment", 'payment method is mandatory').not().isEmpty(),
        check("value", 'value not informed and must be a decimal value').not().isEmpty().isFloat(),
        check("currency", 'Currency not reported').not().isEmpty(),
        check("description", "description not informed").not().isEmpty(),
    ], (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json(errors)
            return;
        }

        let payment = req.body;

        console.log("processando uma requisição de um novo pamaneto")
        payment.status = PAYMENT_CREATED;
        payment.date = new Date;


        let paymentDao = paymentBase(app);

        paymentDao.save(payment, (error, success) => {

            console.log('payment being created.....');
            if (error) {
                console.log('there was an error saving your payment.....');
                console.log('Error: ' + error);
                res.status(500).json(error)
                return;
            }
            console.log('payment successfully generated...')
            res.location('/payments/payment/' + success.insertId)
            res.status(201).json(success)
            return;
        });
    });
}