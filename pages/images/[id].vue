<template>
  <div class="image-detail">
    <picture :key="image?.public_id">
      <img
          alt=""
          :src="`https://res.cloudinary.com/dkx1f5edp/image/upload/f_auto,q_auto,w_2560/v1748888379/${image?.public_id}.jpg`" />
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
const { data, error } = await useFetch('/api/images')

if (error.value) {
  throw new Error(`Failed to fetch images: ${error.value.message}`)
}

const images = computed(() => data.value?.resources ?? [])

const imageIndex = computed(() => {
  const publicId = route.params.id

  if (typeof publicId !== 'string') {
    return -1
  }

  return images.value.findIndex(img => img.public_id === publicId)
})

if (imageIndex.value === -1) {
  throw new Error(`Image with public_id "${route.params.id as string}" not found`)
}

const previousIndex = useState<number | null>('image-detail-previous-index', () => null)
const direction = useState<'next' | 'prev' | null>('image-detail-direction', () => null)

watch(
  imageIndex,
  newIndex => {
    if (newIndex === -1) {
      direction.value = null
      return
    }

    if (previousIndex.value === null || previousIndex.value === newIndex) {
      direction.value = null
    } else {
      direction.value = newIndex > previousIndex.value ? 'next' : 'prev'
    }

    previousIndex.value = newIndex
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  direction.value = null
  previousIndex.value = null
})

const image = computed(() => images.value[imageIndex.value] ?? null)

const prevImage = computed(() =>
  imageIndex.value > 0 ? images.value[imageIndex.value - 1] : null
)

const nextImage = computed(() =>
  imageIndex.value < images.value.length - 1 ? images.value[imageIndex.value + 1] : null
)

const transitionName = computed(() => {
  if (direction.value === 'next') {
    return 'slide-left'
  }

  if (direction.value === 'prev') {
    return 'slide-right'
  }

  return 'fade'
})

const pageTransition = computed(() => ({
  name: transitionName.value
}))

definePageMeta({
  pageTransition
})
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

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active,
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.slide-left-leave-from,
.slide-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

.slide-right-leave-from,
.slide-right-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
