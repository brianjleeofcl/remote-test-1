const path = require('path');

const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const parser = require('body-parser');
const aws = require('aws-sdk')
const s3 = new aws.S3()

app.use(express.static(path.join('public')))

app.use(parser.raw())

app.post('/upload', (req, res) => {
  s3.postObject({
    ACL: 'public-read',
    Bucket: 'brianjleeofcl-test',
    Key: `test-${Date.now()}.jpg`,
    Body: req.body,
    ContentEncoding: 'base64',
    ContentType: 'image/jpg',
  }, (err, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(500)
    } else {
      console.log(data)
      res.send(data.ETag)
    }
  })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`listening on port ${port}`);
})

io.on('connection', (client) => {
  console.log('connected');
  client.on('join', (data) => {
    console.log(data);
    client.join('room').send('Server sending message on 3000').emit('instruction-led-ready')
  })
  client.on('instruction-led-server', (message) => {
    console.log(message);
    client.to('room').emit(`instruction-led-${message}`, 2000)
    client.emit('instruction-received', 'Instructions sent')
  })

  client.on('instruction-camera-server', (interval, term) => {
    client.to('room').emit('instruction-camera-on', interval, term)
    client.emit('instruction-received', 'Instructions sent')
  })

  client.on('message', console.log)
})
