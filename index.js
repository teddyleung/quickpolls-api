var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

 // TODO: Update for production
io.origins(['http://localhost:3000', 'http://localhost:5000']);

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