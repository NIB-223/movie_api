const http = require('http');  //Variables for http module
fs = require('fs');
url = require('url');

http.createServer((request, response) => {  //create server function created, 
    let addr = request.url,                 //get URL from request 
        q = url.parse(addr, true),          //parse the URL
        filepath = '';                      //file path

    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {  //creates logs that include URL and date/time.
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log');
        }
    });

    if (q.pathname.includes('documentation.html')) {   //if pathname of URL includes the words "documentation", combine __dirname and 
        //documentation and place them in the "filePath variable", else take me back to homepage
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {   //sends back the appropritate file
        if (err) {
            throw err;
        }
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data);
        response.end();
    });

    http.createServer((request, response) => {
        response.writeHead(200, { 'Content-Type:': 'text/plain' });
        response.end('Hello Node!\n');
    });
}).listen(8080);
console.log('Server running on Port 8080.');
