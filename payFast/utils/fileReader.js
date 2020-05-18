const fs = require('fs');

fs.readFile('../images/image.png', function(error,buffer){

console.log('aquivo lido ');
fs.writeFile('image23.png',buffer,function(err){
    if(err){

        return;
    }
console.log('arquivo escrito')
})
});