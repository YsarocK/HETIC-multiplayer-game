<template>
  <div>
    <KeyListener />
  </div>
</template>

<script setup lang="ts">
import io from "socket.io-client";

const { SOCKET_SERVER_URL } = useRuntimeConfig().public;
const socket = io(SOCKET_SERVER_URL);

console.log('coonnect')

// Game content
let game = reactive(undefined);

// Socket player ID
let id = ref(undefined);

// Player 1 (left) or 2 (right)
let player = ref(undefined);

socket.on('connect', () => {
  id.value = socket.id;
});

socket.on('game', (pong) => {
  if(player.value === undefined) {
    player.value = id.value === pong.players[0].id ? 1 : 2;
  }
})


const emitSocket = (event: string, data: any) => {
  socket.emit(event, data);
}

const onSocket = (event: string, callback: any) => {
  socket.on(event, callback);
}
</script>