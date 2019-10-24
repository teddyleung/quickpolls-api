const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
require('dotenv').config();
const pollsRouter = require('./routes/polls');

// app.use(cors()); TODO: add CORS
app.use(express.json());
app.use('/polls', pollsRouter);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

let numParticipants = 0;
let poll = {
  a: 0,
  b: 0,
  c: 0,
}

// TODO: Update for production
io.origins(['http://localhost:3000', 'http://localhost:5000']);

io.on('connection', socket => {
  console.log('connected: ', socket.id);
  numParticipants++;
  io.emit('connected', { numParticipants, poll });
  
  socket.on('disconnect', () => {
    console.log('disconnected: ', socket.id);
    numParticipants--;
    io.emit('disconnected', numParticipants);
  });

  socket.on('answer', data => {
    poll[data]++;
    io.emit('poll', poll);
  })
});