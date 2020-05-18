const soap = require('soap');

function PostOfficesClient() {
    this._urlSOAP = process.env.ROUTER_CLIET_POST_OFFICES;

}


PostOfficesClient.prototype.deliveryTimeCalculation = function(args, callback) {

    soap.createClient(this._urlSOAP, function (error, client, ) {
        console.log('soap client created')
        let { zipCodeSouce, zipCodeDestination } = args;

        client.CalcPrazo(
            {
                'nCdServico': '40010',
                'sCepOrigem': zipCodeSouce,
                'sCepDestino': zipCodeDestination
            },
            callback
        )
    });

}



module.exports = () => {
    return PostOfficesClient;
};




