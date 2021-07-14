
const express = require('express')
const app = express()
const mongoose  = require('mongoose')
const PORT = process.env.PORT || 5000
const {MONGOURI} = require('./config/keys')

var cors = require('cors')
app.use(cors({
    origin:"*",
}))

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
 }).then(()=>{
    console.log(`connection sucessful`);
    
 }).catch((err)=>console.log(`no connection ${err}`)
 );
require('./models/user')
require('./models/post')

app.use(express.json())//convert all request to json

app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log("server is running on",PORT)
})

