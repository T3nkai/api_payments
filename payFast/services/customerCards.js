const restifyClients = require('restify-clients');

function customerCards() {
    this._client = restifyClients.createJsonClient({
        url: process.env.ROUTE_CLIENT,
    });
}

customerCards.prototype.authorize = function(cards,callback){
    this._client.post('/cards/authorize', cards,callback)
}


module.exports = () => {
    return customerCards;
}