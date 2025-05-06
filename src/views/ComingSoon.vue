<template>
    <div class="md:h-screen h-[60vh] w-full bg-cover flex flex-col justify-end" 
    :style="{ backgroundImage: `url(${imageSrc})`, backgroundPosition: 'center 90%', backgroundSize: bgSize, backgroundRepeat: 'no-repeat'}">
        <div class="padding-section grid grid-cols-6 md:grid-cols-12 mb-10 md:mb-20">
            <div class="col-span-5 md:col-span-7 col-start-1 md:col-start-3 bg-black-light flex flex-col  justify-between items-end md:items-center rounded-3xl py-[2%] px-[3%] gap-[3%]">
                <p class="text-white text-[18px] md:text-[54px] text-right font-black">...משהו מתבשל פה</p>
                <p class="text-[16px] md:section-content text-white text-right">
                    העמוד הזה עדיין בתהליך התהוות ויצירה<br>
                </p>
                <p class="text-[16px] md:section-content text-white text-right">
                    מבטיחות שמשהו יחכה לך כאן ממש בקרוב
                </p>
            </div>
        </div>
        
    </div>
    <div class="margin-half-section-top">
        <ContactMeWrapper bgColor="gray"/>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import useImageMetadata from '@/composables/fetchImageMetadata'
import ContactMeWrapper from '@/components/ContactMeWrapper'

const { imagesMetadata, getImageUrl } = useImageMetadata();

const selectedLang = ref("he")

const bgSize = ref('160%')

const imageSrc = computed(() => {

    if (imagesMetadata?.value?.length){
        return  getImageUrl("XfQLd0ivsCa3ZdAs8rUC")
    }

    return ""
})

onMounted(() => {
  const width = window.innerWidth
  if (width >= 768) bgSize.value = '100%'
  else if (width < 768) bgSize.value = '160%'
})
</script>

<style>

</style>