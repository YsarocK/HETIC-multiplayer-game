<template>
  <div>
    <RoomManager />
    <button @click="() => emit()">Emit</button>
  </div>
</template>

<script setup lang="ts">
const socket = useSocket()

const emit = () => {
  socket.on('new_user', (message) => {
    console.log('new user' + message)
  })

  socket.emit('new_user', 'room1')
}
</script>