<template>
  <div class="my-10 mx-10 md:mx-40 flex flex-col gap-16">
    <!-- first part -->
    <div v-if="clientDoc && !errrorLoadClientDoc" class="grid grid-cols-[3fr_2fr]">

        <!-- image -->
         <div class="rounded-3xl overflow-hidden">
            <img :src=clientMainImage class="h-full object-cover" alt="">
         </div>
         <!-- header and icons -->
        <div class="flex flex-col items-center justify-between w-[60%] mx-auto">
            <div class="flex flex-col  gap-10 justify-between text-center">
                <p class="mega-title text-center leading-tight">{{ clientDoc.translations.he.title }}</p>
                <p class="section-title-main">{{ clientDoc.translations.he.sub_title }}</p>
            </div>
            <div class="grid grid-cols-[1fr_3fr_1fr]">
                <div class="col-start-2 col-span-1">
                    <BlogIcons iconBg="beige" :vertical="true" class="max-w-full"/>
                </div>
            </div>
        </div>
    </div>
    <div v-else-if="errrorLoadClientDoc">
      ERROR LOADING CLIENT
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router';

import getDocument from '@/composables/getDocument';
import useImageMetadata from '@/composables/fetchImageMetadata'
import getCollection from '@/composables/getCollection';

const language = "he"

const route = useRoute();
const id = ref(route.params.id)

const { error: errrorLoadClientDoc, document : clientDoc } = getDocument("clients", id.value)
const { imagesMetadata, error: errorUseImageMetadata, getMainImageUrl } = useImageMetadata();

const { documents : projects, error : errorGetProjects, fetchCollectionOnce } = getCollection('pojects')

onMounted 


const clientMainImage = computed(() => {

  if (imagesMetadata?.value?.length && clientDoc.value ){
      return getMainImageUrl(clientDoc.value.default.images_metadata)
  }

  return ""
})

</script>

<style>

</style>