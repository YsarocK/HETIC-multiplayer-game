<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Pong } from './Pong';

const socket = useSocket()

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  const pong = new Pong(canvasRef.value, socket)
})
</script>

<template>
  <canvas ref='canvasRef' width="600" height="400" class="pongcontainer" />
</template>