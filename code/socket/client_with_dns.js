const net = require('net') //Package used to create a http socket

// If you don't want node to do DNS lookup for us we can do this
const dns = require('dns')

dns.lookup('example.com',(err, address)=>{
    if (err) throw err


const socket = net.createConnection({
    host: address, //ip address
    port: 80
})
//Its possible that one IP can host multiple domains, so you need to provide the Host header exactly, or else the server will throw error
//or show random page
const request = `
GET / HTTP/1.1
Host: example.com  

                
`.slice(1)  
socket.write(request)

socket.pipe(process.stdout)
socket.closed
})