var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let numParticipants = 0;
let poll = {
  a: 0,
  b: 0,
  c: 0,
}

io.on('connection', socket => {
  numParticipants++;
  io.emit('connected', { numParticipants, poll });
  
  socket.on('disconnect', reason => {
    numParticipants--;
    io.emit('disconnected', numParticipants);
  });

  socket.on('answer', data => {
    poll[data]++;
    io.emit('poll', poll);
  })
});