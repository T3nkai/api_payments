const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');


module.exports = ()=>{


    let app = express();

    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());

        consign()
            .include('routes')
            .into(app)
            
    return app;
};