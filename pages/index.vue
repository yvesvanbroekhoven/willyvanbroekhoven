<template>
  <h1>
    <span>Willy </span>
    <span>Van </span>
    <span>Broekhoven</span>
  </h1>

  <h2>
    <span>Natuur </span>
    <span>Fotografie</span>
  </h2>

  <NuxtLink
      v-for="image in images"
      :key="image.public_id"
      :to="{ name: 'images-id', params: { id: image.public_id } }"
  >
    <picture>
      <img
          alt=""
          :src="`https://res.cloudinary.com/dkx1f5edp/image/upload/f_auto,q_auto,w_512/v1748888379/${image.public_id}.jpg`" />
    </picture>
  </NuxtLink>
</template>

<script setup lang="ts">
const { data, error } = await useFetch('/api/images')

if (error.value) {
  throw new Error(`Failed to fetch images: ${error.value.message}`)
}

const images = data.value.resources
</script>