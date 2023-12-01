<template>
  <div></div>
</template>

<script setup lang="ts">
const { up, down } = useMagicKeys()

watch(up, (v) => {
  if (v)
    console.log('up has been pressed')
})

watch(down, (v) => {
  if (v)
    console.log('down has been pressed')
})
</script>