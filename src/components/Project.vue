<template>
    <div class="grid grid-cols-12 gap-y-20" :dir="directionClass">
      <div class="col-span-4">

        <!-- Title -->
        <p class="break-words max-w-[70%]  text-[27px] font-black">{{ projectDoc.translations[language]?.title }}</p>
    
        <!-- Subtitle -->
        <p class="text-[18px] font-light">{{ projectDoc.translations[language]?.sub_title }}</p>
      </div>
      <div class="col-start-6 col-span-7 aspect-[746/420] overflow-hidden rounded-lg">
        <img :src="mainImageUrl" alt="" class="object-cover w-full h-auto">
      </div>
      <!-- Images Gallery -->
      <div class="col-span-12">
        <Scroller :items="galleryImgs" :itemWidth="25" :itemGap="1.4" :aspect="1"
        @click="(item) => { isGalleryOpen = true; currentGalleryImageIndex = item.index }"
        >
        </Scroller>
      </div>
    </div>
    <div v-if="isGalleryOpen">
      <ScrollerModel :images="galleryImgs" :index="currentGalleryImageIndex"  @close="isGalleryOpen = false"/>
    </div>
  </template>
  
  <script setup>
  import { computed, defineProps, watchEffect, ref } from 'vue';
  import useImageMetadata from '@/composables/fetchImageMetadata'
  import Scroller from './Scroller.vue';
  import ScrollerModel from './ScrollerModel.vue';

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

  const language = ref(props.language  || "he")

  const directionClass = ref('')
  directionClass.value = language.value === 'he' ? "rtl" : "lft"

  const galleryImgs = ref([])

  const isGalleryOpen = ref(false)
  const currentGalleryImageIndex = ref(0)

  const { imagesMetadata, error, getImagesUrlByRole, getMainImageUrl } = useImageMetadata();

  const mainImageUrl = computed(() => getMainImageUrl(props.projectDoc?.default?.images_metadata))

  watchEffect(() => {
    if (imagesMetadata?.value?.length && props.projectDoc){
      console.log( "project images metadata" ,props.projectDoc.default.images_metadata)
      galleryImgs.value = getImagesUrlByRole(props.projectDoc.default.images_metadata, "sub")?.map((item, index) => {
                return { image: item.url, index: index }
            })
    }

  })

  </script>
  
  <style scoped>
  /* Optional additional styling */
  </style>
  