const { check, validationResult } = require('express-validator');

module.exports = app => {


    app.post('/cards/authorize', [
        check("card_number", 'mandatory card number and must have 16 characters').not().isEmpty().isLength({ min: 16, max: 16 }),
        check("card_flag", 'flag is required').not().isEmpty(),
        check("expiration_year", 'expiration year is mandatory and must have 4 characters').not().isEmpty().isLength({ min: 4, max: 4 }),
        check("expiration_month", "expiration month is mandatory and must have 2 characters").not().isEmpty().isLength({ min: 2, max: 2 }),
        check("cvv", "card security number is mandatory and must have 3 characters").not().isEmpty().isLength({ min: 3, max: 3 }),
    ], (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("validation error found");
            res.status(400).send(errors)
            return;
        }

        let card = req.body;

        card.status = 'AUTORIZADO';



            let response = {
                card
            }
            res.status(201).json(response)
            return;
    });
}