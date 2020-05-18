const fs = require('fs');

module.exports = function (app) {

    app.post("/upload/image", (req, res) => {
        console.log("recebendo image")

        let filename = req.headers.filename;
        let body = req.pipe(fs.createWriteStream('images/' + filename))
            .on('finish', function () {
                console.log('arquivo escrito com stream')
                res.status(201).send('ok')
                return;
            })

    });

}