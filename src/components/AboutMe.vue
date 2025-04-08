<template>
  <div class="relative bg-black-light h-full">
    <!-- Background Image -->
    <div class="w-full h-full bg-cover" :style="{  backgroundImage: `url(${backgroundImage})`, backgroundPosition: 'center 100%' }">
      <div class="absolute inset-0 bg-black-light opacity-20"></div>

      <div class="relative padding-section">
        <div class=" h-full grid grid-cols-12  gap-[0.5%]"
        :class="{
          'pt-[14%]' : aspectRatio <= 1.8,
          'pt-[9%]' : aspectRatio > 1.8
        }">
          <!-- Quatations Image -->
          <div class="col-span-3 col-start-1 aspect-[1.52] ">
              <img :src="quotedImg" alt="quote Image"
                  class="object-cover h-full scale-110">
          </div>
          <!-- Quote Text -->
          <div class="col-span-4 flex flex-col text-white ">
              <p  class="sub-title text-left font-heebo black-light tracking-wide  leading-tight">Don't be pushed</p> 
              <p  class="sub-title text-left font-heebo black-light tracking-wide  leading-tight">by your problems</p>
              <p  class="sub-title text-left font-heebo black-light tracking-wide leading-tight">be led by your dreams</p>
              <p  class="section-content font-heebo black-light text-left">Ralph Waldo Emerson</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { watchEffect, onMounted, ref } from 'vue';
import useImageMetadata from '@/composables/fetchImageMetadata'
import useGeneralContentMetadata from '@/composables/fetchGeneralContent';

export default {
  setup(){
    const backgroundImage = ref('')
    const quotedImg = ref('')

    const aspectRatio = ref(null)
    
    const { imagesMetadata, error } = useImageMetadata();

    const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()

    const handleSize = () => {
      aspectRatio.value = window.innerWidth / window.innerHeight;

      console.log("aspectRatio", aspectRatio.value)
    }
    onMounted(() => {
      window.addEventListener("resize", handleSize);
      aspectRatio.value = window.innerWidth / window.innerHeight;

      console.log("aspectRatio", aspectRatio.value)
    })

    watchEffect(() => {
        if (imagesMetadata?.value?.length && generalContentMetadata?.value?.get("about_me")){
            const generalContentItem = generalContentMetadata.value.get("about_me")
            let coverImgMd = imagesMetadata.value.filter( item => item.id === generalContentItem.common_data?.images_metadata?.cover)

            if (coverImgMd?.length){
              backgroundImage.value = coverImgMd[0].image_url
            }
            else{
              console.error('no iimagesMetadatamage metadata for about me cover')
            }

            let quatesImgMd = imagesMetadata.value.filter( item => item.id === generalContentItem.common_data?.images_metadata?.quotes)

            if (quatesImgMd?.length){
              quotedImg.value = quatesImgMd[0].image_url
            }
            else{
              console.error('no image metadata for about me quotes')
            }
          }
        })

    return { backgroundImage, quotedImg, aspectRatio }
  }
}
</script>

<style>

</style>