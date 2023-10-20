const net = require('net') //Package used to create a http socket



const socket = net.createConnection({
    host: 'example.com',
    port: 80
})
const request = `
GET / HTTP/1.1
Host: example.com  

                
`.slice(1) // There shouldn't be newline in the beginning, so instead we just split it or we can backspace it as well and start like `GET ...
// When writing a request, you know to add two blank lines in order for the server to know that the request is finished 
socket.write(request)

socket.pipe(process.stdout)
socket.closed
//Here we didn't close the socket so either the website will close it for us or will hang, it's a good practice to close the socket