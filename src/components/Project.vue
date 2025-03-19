<template>
    <div class="flex flex-col items-center text-center gap-4">
      <!-- Title -->
      <p class="header-title">{{ projectDoc.translations[language]?.title }}</p>
  
      <!-- Subtitle -->
      <p class="header-sub-title">{{ projectDoc.translations[language]?.sub_title }}</p>
  
      <!-- Images Gallery -->
        
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
        <div>
            <img :src="mainImageUrl" alt="" class="object-cover">
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, defineProps } from 'vue';
  import useImageMetadata from '@/composables/fetchImageMetadata'
  
  const props = defineProps({
    projectDoc: {
      type: Object,
      required: true
    },
    language: {
      type: String,
      required: true
    }
  });

  const { imagesMetadata, error, getImageUrl, getMainImageUrl } = useImageMetadata();

  const mainImageUrl = computed(() => getMainImageUrl(props.projectDoc?.default?.images_metadata))

  </script>
  
  <style scoped>
  /* Optional additional styling */
  </style>
  