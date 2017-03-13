'use strict'

const five = require('johnny-five');
const Tessel = require('tessel-io')

const io = require('socket.io-client');

const board = new five.Board({
  io: new Tessel()
})

board.on('ready', () => {
  const socket = io.connect('http://brianjleeofcl-endpoint-test.herokuapp.com')
  const leds = new five.Leds(['a2', 'a6'])
  const instructions = {
    go: leds[0],
    ready: leds[1]
  }

  socket.on('connect', () => {
    socket.emit('join', 'Board says hello')
  })

  socket.on('instruction-led-ready', () => {
    instructions.ready.on()
  })

  socket.on('instruction-led-go', time => {
    instructions.go.on()
    board.wait(time, () => {
      instructions.go.off()
      instructions.ready.on()
    })
  })
})
