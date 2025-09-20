<template>
  <div class="image-detail">
    <picture>
      <img
          alt=""
          :src="`https://res.cloudinary.com/dkx1f5edp/image/upload/f_auto,q_auto,w_2560/v1748888379/${image.public_id}.jpg`" />
    </picture>

    <div class="image-detail__actions">
      <NuxtLink
          v-if="prevImage"
          class="image-detail__link"
          :to="{ name: 'images-id', params: { id: prevImage.public_id } }"
      >
        Vorige
      </NuxtLink>
      <NuxtLink class="image-detail__link" to="/">
        Terug
      </NuxtLink>
      <NuxtLink
          v-if="nextImage"
          class="image-detail__link"
          :to="{ name: 'images-id', params: { id: nextImage.public_id } }"
      >
        Volgende
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const publicId = route.params.id as string
const { data, error } = await useFetch('/api/images')

if (error.value) {
  throw new Error(`Failed to fetch images: ${error.value.message}`)
}

const images = data.value?.resources ?? []
const index = images.findIndex(img => img.public_id === publicId)

if (index === -1) {
  throw new Error(`Image with public_id "${publicId}" not found`)
}

const image = images[index]
const prevImage = index > 0 ? images[index - 1] : null
const nextImage = index < images.length - 1 ? images[index + 1] : null
</script>

<style scoped>
.image-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.image-detail__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.image-detail__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.1);
  color: inherit;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out;
}

.image-detail__link:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
