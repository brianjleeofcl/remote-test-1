const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join('public')))

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
})

io.on('connection', (client) => {
  console.log('connected');
  client.on('join', (data) => {
    console.log(data);
    client.join('room').send('Server sending message on 3000').emit('instruction-led-ready')
  })
  client.on('instruction-server', (message) => {
    console.log(message);
    client.broadcast.to('room').emit(`instruction-led-${message}`, 2000)
    client.emit('instruction-received', 'Instructions sent')
  })
})
