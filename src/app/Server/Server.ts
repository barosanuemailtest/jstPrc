import * as http from 'http';

export class Server {

    public createServer() {

        http.createServer(async (req, res) => {
            console.log('got request from ' + req.url)
            switch (req.url) {
                case '/login':
                    await this.handleLogin(req, res);
                    break;

                default:
                    break;
            }
            res.end();
        }).listen(8080);
        console.log('started server')
    }

    private async handleLogin(request: http.IncomingMessage, response: http.ServerResponse) {
        if (request.method !== 'POST') {
            response.statusCode = 404;
            return;
        }
        let body = '';
        request.on('data', data => {
            console.log('gotData: ' + data);
            body += data;
        })
        console.log('parsing body: ' + body)
        const parsedBody = JSON.parse(body);
        const userName = parsedBody.username;
        const password = parsedBody.password;
        response.write('you logged in...')
    }

}
