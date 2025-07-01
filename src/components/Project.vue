<template>
    <div class="grid grid-cols-6 md:grid-cols-12 gap-y-8 md:gap-y-20">
      <div class="col-span-6 md:col-span-4 flex flex-col gap-y-4">

        <!-- Title -->
        <p class="break-words max-w-[70%]  text-[27px] font-black">{{ projectDoc.translations[language]?.title }}</p>
    
        <!-- Subtitle -->
        <p class="text-[18px] font-light">{{ projectDoc.translations[language]?.sub_title }}</p>
      </div>
      <div v-if="!deviceStore.isMobile" class="col-start-6 col-span-7 aspect-[746/420] overflow-hidden rounded-lg">
        <img :src="mainImageUrl" alt="" class="object-cover w-full h-auto">
      </div>
      <!-- Images Gallery -->
      <div class="col-span-6 md:col-span-12">
        <Scroller :items="galleryImgs" :itemWidth="deviceStore.isMobile ? 50 : 16" :itemGap="deviceStore.isMobile ? 1.4 : 2" :aspect="1"
        @click="(item) => { isGalleryOpen = true; currentGalleryImageIndex = item.index }"
        >
        </Scroller>
      </div>
    </div>
    <div v-if="isGalleryOpen">
      <ScrollerModal :images="galleryImgs" :index="currentGalleryImageIndex"  @close="isGalleryOpen = false"/>
    </div>
  </template>
  
  <script setup>
  import { computed, defineProps, watchEffect, ref } from 'vue';
  import useImageMetadata from '@/composables/fetchImageMetadata'
  import Scroller from './Scroller.vue';
  import ScrollerModal from './ScrollerModal.vue';
  import { useDeviceStore } from '@/stores/deviceStore'

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

  const deviceStore = useDeviceStore()

  const language = ref(props.language  || "he")

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
  