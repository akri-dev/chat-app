// Import necessary dependencies
const express = require('express')  // Import the Express application
const app = express()  // Create a new instance of the Express application
const http = require('http').createServer(app)  // Create an HTTP server using the Express application
const io = require('socket.io')(http)  // Create a new instance of Socket.io using the HTTP server

// Set up middleware and routes below
