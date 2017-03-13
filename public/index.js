(function() {
  'use strict';

  const socket = io()

  document.getElementById('button-1').addEventListener('click', () => {
    socket.emit('instruction-led-server', 'go')
  })

  document.getElementById('button-2').addEventListener('click', () => {
    socket.emit('instruction-camera-server', 2000, 20)
  })
})();
