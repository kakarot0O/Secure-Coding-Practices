const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { randomBytes } = require('crypto')
const USERS ={
    alice: 'password',
    bob: 'test123'
}
const BALANCES ={
    alice: 5000,
    bob: 1000
}
const SESSIONS = {} 
const app = express()
app.use(bodyParser.urlencoded({extended: false})) 
app.use(cookieParser())

app.get('/',(req,res)=>{
    const sessionID = req.cookies.sessionId
    const username = SESSIONS[sessionID]
    if (username) {
        const balances = BALANCES[username]
        res.send(`Hi ${username} ! Your balance is $${balances}.
        <form method='POST' action='/transfer'>
        Send amount:
        <input name='amount'/>
        To user:
        <input name='to' />
        <input type='submit' value='Send' />
        </form>
        `)
    }
    else{
    fs.createReadStream('../index.html').pipe(res) 
    }
})

app.post('/transfer',(req,res)=>{
    const sessionId = req.cookies.sessionId
    const username = SESSIONS[sessionId]
    if(!username){
        res.send('Pleas login first !')
        return
    }
    const amount = Number(req.body.amount)
    const to = req.body.to

    BALANCES[username] -= amount
    BALANCES[to] += amount

    res.redirect('/')
})
app.post('/login',(req,res)=>{
    const username = req.body.username
    const password = USERS[username]
    if (req.body.password == password) {
        const nextSessionId = randomBytes(16).toString('base64')
        res.cookie('sessionId',nextSessionId,{
            httpOnly: true,
            sameSite: 'lax', //This should particularly help us against CSRF attacks
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        } )
        SESSIONS[nextSessionId] = username
        res.redirect('/')
    }
    else{
        res.send ("BOOOOOOOOOO :(")
    }
})

app.get('/logout',(req,res)=>{ 
    const sessionID = req.cookies.sessionId
    delete SESSIONS[sessionID]
    res.clearCookie('sessionId',{
        httpOnly: true,
        sameSite: 'lax'
    }) 
    res.redirect('/')
})
app.listen(4000) 
console.log("Listening on http://localhost:4000")
