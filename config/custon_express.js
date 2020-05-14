const express = require('express');
const consign = require('consign')


module.exports = ()=>{


    let app = express();

        consign()
            .include('routes')
            .into(app)
            
    return app;
};