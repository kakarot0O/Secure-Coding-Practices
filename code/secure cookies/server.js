const express = require('express')
// const { createReadStream } = require('fs') //equivalent of java import => import createReadStream from fs
// In node the above statement can also be written as const createReadStream = require('fs').createReadStream
const fs = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const USERS ={
    alice: 'password',
    bob: 'test123'
}
const BALANCES ={
    alice: 5000,
    bob: 1000
}
const app = express()
app.use(bodyParser.urlencoded({extended: false})) // To not parse the username and password in this form sername=alice&password=test&submit=Submit we use this package to make things easier
app.use(cookieParser())

app.get('/',(req,res)=>{
    const username = req.cookies.username
    if (username) {
        const balances = BALANCES[username]
        res.send(`Hi ${username} ! Your balance is $${balances}`)
    }
    else{
    fs.createReadStream('../index.html').pipe(res) //As soon as I read something, I send it out to the socket 
    }
})

app.post('/login',(req,res)=>{
    // console.log(req.body) //Body property is the object which will contain the key and value pair of username and password
    const username = req.body.username
    const password = USERS[username]
    if (req.body.password == password) {
        res.cookie('username',username)
        res.redirect('/')
        // res.send('BRAVO!')
    }
    else{
        res.send ("BOOOOOOOOOO :(")
    }
})

app.get('/logout',(req,res)=>{ //The way to logout a user is to simply delete the cookie
    res.clearCookie('username')
    res.redirect('/')
})
app.listen(4000) //Created a socket
console.log("Listening on http://localhost:4000")
