const { check, validationResult } = require('express-validator/check');



module.exports = app => {

    const PAYMENT_CREATED = "CREATED";
    const PAYMENT_CONFIRMED = "CONFIRMED";
    const PAYMENT_CANCELED = "CANCELED";

    app.get('/payments', (req, res) => {


        let connection = app.persistence.connectionFactory();
        let paymentDao = new app.persistence.PaymentDao(connection);


        paymentDao.list((error, success) => {
            console.log('pagamentos .....');
            res.json(success)
            return;
        });
    });

    app.post('/payments/payment', [
        check("form_of_payment", 'payment method is mandatory').not().isEmpty(),
        check("value", 'value not informed and must be a decimal value').not().isEmpty(),
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
        payment.status = 'pagamento gerado com sucesso';
        payment.date = new Date;

        let connection = app.persistence.connectionFactory();
        let paymentDao = new app.persistence.PaymentDao(connection);


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