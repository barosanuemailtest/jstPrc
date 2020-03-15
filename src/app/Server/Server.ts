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

            console.log('out of the await')



            res.end();
        }).listen(8080);
        console.log('started server')
    }

    private async handleLogin(request: http.IncomingMessage, response: http.ServerResponse) {
        response.write('you logged in...')
    }

}
