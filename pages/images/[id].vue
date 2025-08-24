<template>
  <div class="image-detail">
    <picture>
      <img
          alt=""
          :src="`https://res.cloudinary.com/dkx1f5edp/image/upload/f_auto,q_auto,w_2560/v1748888379/${image.public_id}.jpg`" />
    </picture>

    <NuxtLink class="image-detail__back" to="/">
      Terug
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const publicId = route.params.id
const { data, error } = await useFetch('/api/images')

if (error.value) {
  throw new Error(`Failed to fetch images: ${error.value.message}`)
}

const image = data.value.resources.find(img => img.public_id === publicId)
</script>