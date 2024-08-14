const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res) => {
    const url = req.url;

    const method = req.method;
    if(url === '/'){
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message" /><button type="submit">Send</button><form></body>');
        res.write('</head>');
        return res.end();
    }

    if(url === '/message' && method === 'POST'){
        fs.writeFileSync('message.txt', 'Dummy Text');
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my node server</h1></body>');
    res.write('</head>');
    res.end();
});

server.listen(3000);