(function() {
  'use strict';

  const socket = io()

  document.getElementById('button').addEventListener('click', () => {
    socket.emit('instruction-server', 'go')
  })
})();
