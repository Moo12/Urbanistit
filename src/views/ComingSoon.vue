<template>
    <div class="h-screen w-full bg-cover flex flex-col justify-center items-center" :style="{  backgroundImage: `url(${imageSrc})`, backgroundPosition: 'center 80%' }">
        <div class="bg-black-light flex flex-col justify-between items-center rounded-3xl py-[2%] px-[3%] gap-[3%]  mt-[28%]">
            <p class="text-white text-fifty-four-px font-black">...משהו מתבשל פה</p>
            <p class="section-content text-white">
                העמוד הזה עדיין בתהליך התהוות ויצירה<br>
                מבטיחות שמשהו יחכה לך כאן ממש בקרוב
            </p>
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