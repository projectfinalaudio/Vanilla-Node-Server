const dotenv = require('dotenv').config();
const log = console.log;
const { logEvents } = require('./log_events');
const fs = require('fs');
const path = require('path');
const url = require('url');
const http = require('http');
const server = http.createServer;
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const EventEmitter = require('events');
const Emitter = new EventEmitter();
Emitter.on('log', (message, file_name) => logEvents(message, file_name));
server((req, res) => {
    log(req.url, req.method);
    Emitter.emit('log', `${req.url}\t${req.method}`, 'request_log.log');
    let file_ext = path.extname(req.url);
    let content_type;
    if (file_ext === '.css') {
        content_type = 'text/css';
    } else if (file_ext === '.js') {
        content_type = 'text/javascript';
    } else if (file_ext === '.json') {
        content_type = 'application/json';
    } else if (file_ext === '.jpg') {
        content_type = 'image/jpeg';
    } else if (file_ext === '.png') {
        content_type = 'image/png';
    } else if (file_ext === '.txt') {
        content_type = 'text/plain';
    } else {
        content_type = 'text/html';
    }
    let file_path;
    if (content_type === 'text/html' && req.url === '/') {
        file_path = path.join(__dirname, 'views', 'index.html');
    } else if (content_type === 'text/html' && req.url.slice(-1) === '/') {
        file_path = path.join(__dirname, 'views', req.url, 'index.html');
    } else if (content_type === 'text/html') {
        file_path = path.join(__dirname, 'views', req.url);
    } else {
        file_path = path.join(__dirname, 'views', 'index.html');
    }
    if (!file_ext && req.url !== '/') file_path += '.html';

    if (fs.existsSync(file_path)) {
        fs.readFile(file_path, 'utf8', (err, data) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-type': 'text/html' });
            res.end(data);
        });
    } else {
        log('404 : File Not Found...');
        fs.readFile(path.join(__dirname, 'views', '404.html'), 'utf8', (err, data) => {
            res.writeHead(404, { 'Content-type': 'text/html' });
            res.end(data);
        });
    }
}).listen(PORT, () => {log(`Server is running on host: ${HOST}:${PORT}`)});



