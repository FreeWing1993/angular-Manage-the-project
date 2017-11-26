/**
 * Created by huyiwen1 on 2017/5/17.
 */
import * as http from 'http'

const server = http.createServer((request,response) => {
    response.end("Hello Node!");
});

server.listen(8001);
