import * as http from 'http';

export class Server {

    public createServer() {

        http.createServer(function (req, res) {
            console.log('got request from ' + req.url)
            res.write('Hello World!');
            res.end();
        }).listen(8080);
        console.log('started server')
    }

}
