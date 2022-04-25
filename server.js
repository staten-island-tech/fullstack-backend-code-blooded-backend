const express = require('express')
const application = express()
const server = require('https').Server(application)
const io = require('socket.io')(server, {})
const GameServiceFactory = require('./node_src/GameServiceFactory.js')
const GameServiceRepository = require('./node_src/GameServiceRepository.js')
const UnitTest = require('./node_src/UnitTest.js')
const unitTest = new UnitTest()

application.get('/', function (request, response) {
  response.sendFile(__dirname + './client/index.html')
})
application.use('./client', express.static(__dirname + './client'))

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))

const gameServiceRepository = new GameServiceRepository()
const gameServiceFactory = new GameServiceFactory()

io.sockets.on('connection', function (socket) {
  console.log('Socket connection')
  socket.on('create', function (room) {
    console.log('Join room: ' + room + ' socketId: ' + socket.id)
    socket.join(room)

    let gameService = gameServiceRepository.findById(room)

    if (!gameService) {
      gameService = gameServiceFactory.create('UNO', room)
      gameServiceRepository.insert(gameService)
    }
    socket.use(function (packet) {
      gameService.handleAction(socket, packet[0], packet[1])
      Object.keys(io.sockets.sockets).forEach(function (id) {
        const data = gameService.getClientResponseData(id)
        if (data) {
          io.to(id).emit('state', data)
        }
      })
    })
  })
})
