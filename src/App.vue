<script setup lang="ts">
import { useFileInput } from '@/composables'

const { browse } = useFileInput()
</script>

<template>
  <div>
    <button type="button" @click="() => browse({ mimeTypes: [] })">test</button>
  </div>
</template>