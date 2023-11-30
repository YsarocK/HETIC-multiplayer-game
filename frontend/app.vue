<template>
  <div>
    <Pong />
    <RoomManager />
    <button @click="() => emit()">Emit</button>
  </div>
</template>

<script setup lang="ts">
import type { Player, Game } from './types/game'

const socket = useSocket()

const emit = () => {
  socket.on('new_user', (message) => {
    console.log('new user' + message)
  })

  socket.on('pong', (message) => {
    console.log('pong')
  })

  socket.emit('new_user', 'room1')
}
</script>