<template>
  <div class="relative bg-black-light h-full">
    <!-- Background Image -->
    <div class="w-full h-full bg-cover" :style="{  backgroundImage: `url(${backgroundImage})`, backgroundPosition: 'center 80%' }">
      <div class="absolute inset-0 bg-black-light opacity-20"></div>

      <div class="relative padding-section">
        <div class=" h-full grid grid-cols-12  items-center mx-auto gap-1  pt-[10%]">
          <!-- Quatations Image -->
          <div class="col-span-2 col-start-2 aspect-[1.52] opacity-100">
              <img :src="quotedImg" alt="quote Image"
                  class="object-cover h-full">
          </div>
          <!-- Quote Text -->
          <div class="col-span-4 flex flex-col text-white">
              <p  class="text-twenty-seven-px font-black text-left font-heebo black-light tracking-wide  leading-tight">Don't be pushed</p> 
              <p  class="text-twenty-seven-px font-black text-left font-heebo black-light tracking-wide  leading-tight">by your problems</p>
              <p  class="text-twenty-seven-px font-black text-left font-heebo black-light tracking-wide leading-tight">be led by your dreams</p>
              <p  class="section-title-main font-heebo black-light text-left">Ralph Waldo Emerson</p>
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
    
    const { imagesMetadata, error } = useImageMetadata();

    const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()


    onMounted(() => {
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

    return { backgroundImage, quotedImg }
  }
}
</script>

<style>

</style>