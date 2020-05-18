const cluster = require('cluster');
const os = require('os');

let cpus = os.cpus()



console.log('executando thread');

if (cluster.isMaster) {

    console.log('thread master')

    cpus.forEach(function(){
        cluster.fork()
    })

    cluster.on('listening', worker => {
        console.log('cluster connected with pid ', worker.process.pid)
    })

    cluster.on('exit',worker => {
        console.log('cluster with pid %d disconnected ', worker.process.pid)
        cluster.fork();
    })

} else {
    console.log('thread slave')
    require('./index')
}
