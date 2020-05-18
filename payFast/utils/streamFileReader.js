const fs = require('fs');

fs.createReadStream('../images/image.png')
    .pipe(fs.createWriteStream('image2135.png'))
    .on('finish',function(){
        console.log('arquivo escrito com stream')
    });