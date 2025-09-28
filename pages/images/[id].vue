<template>
  <div class="image-detail">
    <Transition :name="transitionName" mode="out-in">
      <picture :key="image?.public_id">
        <img
            alt=""
            :src="`https://res.cloudinary.com/dkx1f5edp/image/upload/f_auto,q_auto,w_2560/v1748888379/${image?.public_id}.jpg`" />
      </picture>
    </Transition>

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

const images = data.value?.resources ?? []

const currentIndex = ref(-1)
const direction = ref<'next' | 'prev' | null>(null)

const image = computed(() => images[currentIndex.value] ?? null)
const prevImage = computed(() => (currentIndex.value > 0 ? images[currentIndex.value - 1] : null))
const nextImage = computed(() =>
  currentIndex.value < images.length - 1 ? images[currentIndex.value + 1] : null
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

const updateIndex = (publicId: string, isInitial = false) => {
  const newIndex = images.findIndex(img => img.public_id === publicId)

  if (newIndex === -1) {
    throw new Error(`Image with public_id "${publicId}" not found`)
  }

  if (!isInitial) {
    if (newIndex === currentIndex.value) {
      direction.value = null
    } else {
      direction.value = newIndex > currentIndex.value ? 'next' : 'prev'
    }
  }

  currentIndex.value = newIndex
}

updateIndex(route.params.id as string, true)

watch(
  () => route.params.id,
  newId => {
    if (typeof newId !== 'string') {
      return
    }

    updateIndex(newId)
  }
)
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

.slide-left-enter-from,
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

.slide-left-leave-from,
.slide-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.slide-right-enter-from,
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-40px);
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
