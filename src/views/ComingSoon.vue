<template>
    <div class="flex flex-col justify-center items-center gap-6 mx-auto w-1/3 my-10 ">
        <div class="rounded-3xl overflow-hidden">
          <img :src="imageSrc" alt="Loading" class="w-full object-cover">
        </div>
        <p class="header-title">משהו מתבשל פה</p>
        <div class="flex flex-col justify-center items-center  gap-2">
            <p class="section-title-main">העמוד הזה עדיין בתהליך התהוות ויצירה</p>
            <p class="section-title-main">מבטיחות שמשהו יחכה לך כאן ממש בקרוב</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import useImageMetadata from '@/composables/fetchImageMetadata';

const { imagesMetadata, getImageUrl } = useImageMetadata();

const selectedLang = ref("he")

const imageSrc = computed(() => {

    if (imagesMetadata?.value?.length){
        return  getImageUrl("XfQLd0ivsCa3ZdAs8rUC")
    }

    return ""
})
</script>

<style>

</style>