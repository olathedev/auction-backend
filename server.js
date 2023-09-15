require('dotenv').config()
const express = require('express')
const mongoose =  require('mongoose')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoutes')
const appRoutes = require('./routes/routes')


const cors = require('cors')
const app = express()


const connect = async () => {

    try{
        const con =  await mongoose.connect(process.env.MONGOURI)
        app.listen(process.env.PORT, () =>{
            console.log("connected and listend on port", process.env.PORT)
        })
    }catch(err){
        console.log(err.message)
    }
}

connect()

app.use(cors({
    credentials: true,
    origin: 'https://auction-v1test.vercel.app/'
}))

// middlewares
app.use(express.static('public/uploads'))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

// API ROUTES
app.use('/api/auction', authRoutes)
app.use('/api/auction', appRoutes)
