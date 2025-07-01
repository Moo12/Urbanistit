<template>
  <div class="w-full px-6 pb-12" dir="rtl">
    <!-- Top subtitle -->
    <div class="text-right mb-12">
      <h2 class="text-[18px] font-semibold text-black-light">{{subTitle}}</h2>
    </div>

    <!-- Main content grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Blog content (left column) -->
      <!-- Image or video (right column) -->
      <div class="sticky top-0 self-start">
        <!-- Conditionally render image or video -->
        <img
          v-if="mediaType === 'image'"
          :src="main_image.src"
          alt="Blog media"
          class="w-full h-auto object-contain"
        />
        <video
          v-else-if="mediaType === 'video'"
          :src="main_image.src"
          controls
          class="w-full h-auto object-contain m-0 p-0"
          playsinline
        />
        <div v-else class="text-red-500">Unsupported media type</div>
      </div>
      <div class="relative z-10">
        <div class="prose max-w-none  text-black-light font-light">
          <p>
            {{ content }}
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const props = defineProps({
    blogItem: {
        type: Object,
        required: true
    },
});

console.log("props.blogItem ", props.blogItem)
    
const subTitle = ref(props.blogItem?.sub_title)
const content = ref(props.blogItem?.content)
const main_image = ref(props.blogItem?.main_image)

// Compute media type: fallback to file extension if needed
const mediaType = computed(() => {
  const type = main_image.value?.type;

  if (type) {
    return type
  }

  // Fallback based on file extension (in case type is not provided)
  const url = main_image.value?.src || '';
  if (url.match(/\.(png|jpe?g|webp)$/i)) return 'image';
  if (url.match(/\.(mp4|webm|ogg)$/i)) return 'video';

  return null;
});



</script>