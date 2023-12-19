const { createServer } = require('node:http')
const socket = require('socket.io')
const express = require('express')
const cors = require('cors')
const fs = require('node:fs/promises')
const path = require('path');
const filePath = path.join(__dirname, 'history.txt');
const app = express()
const server = createServer(app)
let precioSubasta = 0.00;
const io = socket(server)
app.use(cors())

io.on('connection', (socket) => {
  console.log('cliente conectado')
  io.emit('actualizar', precioSubasta)

  socket.on('puja', (data) => {
    console.log(data)

    if (!isNaN(data.monto) && data.monto > precioSubasta) {
      precioSubasta = data.monto
      fs.writeFile(filePath, `${data.user},${data.monto}`)
        .catch((err) => console.log('error: ' + err.message))
      io.emit('nuevo-precio', { user: data.user, monto: data.monto });
    }
    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    })
  })


})
server.listen(8000, () => console.log(server.address()))