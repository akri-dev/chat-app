// Import necessary dependencies
const express = require('express')  // Import the Express application
const app = express()  // Create a new instance of the Express application
const http = require('http').createServer(app)  // Create an HTTP server using the Express application
const io = require('socket.io')(http)  // Create a new instance of Socket.io using the HTTP server
const bodyParser = require('body-parser') // Importing the body-parser middleware module to parse incoming request bodies
const cors = require('cors') // Importing the cors middleware module to handle cross-origin resource sharing

// Using bodyParser and cors middleware by calling the use method on the app instance
app.use(bodyParser.json())
app.use(cors())

// Set up database (using MongoDB and Mongoose)
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://alecjoseph-dev:ikTE49zMIo3aljVD@chat-app-cluster.trr69z7.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true })

const Message = mongoose.model('Message', {
  text: String
})

// Set up routes

// Create a new message
app.post('/messages', async (req, res) => {
  try {
    const message = new Message(req.body)
    await message.save()
    io.emit('message', req.body)
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Read all messages
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find({})
    res.send(messages)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Update a message
app.put('/messages/:id', (req, res) => {
  Message.findByIdAndUpdate(req.params.id, req.body, (err) => {
    if (err) {
      res.sendStatus(500)
    } else {
      res.sendStatus(200)
    }
  })
})

// Delete a message
app.delete('/messages/:id', (req, res) => {
  Message.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      res.sendStatus(500)
    } else {
      res.sendStatus(200)
    }
  })
})

// Set up socket.io
io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })

    socket.on('chat message', (msg) => {
      console.log('message: ' + msg)
      io.emit('chat message', msg)
    })
  })

// Start the server
http.listen(3000, () => {
  console.log('Server started on port 3000')
})

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    avatar: String,
    createdAt: { type: Date, default: Date.now },
  })
  
  const User = mongoose.model('User', userSchema)
  