<script setup lang="ts">
import axios from 'axios'
import { useCrud } from './composables';

const { get } = useCrud('https://jsonplaceholder.typicode.com/users')

const test = async() => {
  try {
    const { data } = await get(1)
    const { data: data2 } = await get(data.id)
  }
  catch(e) {
    console.log(e)
  }

  console.log('done')
}

test()
</script>

<template>
  <div></div>
</template>