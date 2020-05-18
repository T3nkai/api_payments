const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const logger = require('../services/logger');

module.exports = () => {


    let app = express();
    app.use(morgan("common", {
        stream: {
            write: function (message) {
                logger.info(message)
            }
        }
    }))

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    consign()
        .include('routes')
        .then('persistence')
        .then('services')
        .into(app)

    return app;
};