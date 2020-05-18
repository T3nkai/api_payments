module.exports = function(app) {

    app.post('/post-offices/delivery-time-calculation',(req, res)=>{
        
        let { zipCodeSouce, zipCodeDestination } = req.body;

        const postOfficesSOAPClient = new app.services.postOfficesSOAPClient();
    
        postOfficesSOAPClient.deliveryTimeCalculation({ zipCodeSouce, zipCodeDestination }, (error, result)=>{
            if(error){
                res.status(500).send(error);
                rerturn;
            }
            res.status(200).json(result)
        });
    });

}