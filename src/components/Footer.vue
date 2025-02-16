<template>
    <div class="w-full h-full bg-cover" :style="{ backgroundImage: `url(${backgroundImage})` }">
        
        <!-- contett -->
        <div class="w-5/6 mx-auto h-full overflow-hidden" >
            <!-- horizontal anchors-->
            <ul  class="flex  h-full flex-row justify-between items-center">
                <li v-for="(item, index) in localMenuItems" :key="index" class="btn h-full">
                    <a :href="item.href" class="no-underline h-full flex items-center">
                        <img v-if="item.image" :src="item.image" alt="item.text" class="h-3/4 self-end object-cover" />
                        <p v-else class="font-bold  md:text-3lg  lg:text-5xl text-background-site">{{ item.text }}</p>
                    </a>
                </li>
            </ul>
        </div>

    </div>
  
</template>

<script>
import { onMounted, watchEffect, ref } from 'vue';
import useImageMetadata from '@/composables/fetchImageMetadata'
import useGeneralContentMetadata from '@/composables/fetchGeneralContent';

export default {
    props: {
      menuItems: {
          type: Array,
          required: true
      },
    },
    setup(props){
        const backgroundImage = ref(null)
        const localMenuItems = ref([...props.menuItems]); // Create a reactive copy
        
        const { imagesMetadata, error } = useImageMetadata();
        const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()


        onMounted(() => {
        })

        watchEffect(() => {
            if (imagesMetadata?.value?.length && generalContentMetadata?.value?.length){
                    generalContentMetadata.value.forEach(generalContentItem => {
                    if (generalContentItem.id === "footer"){
                        let coverImgMd = imagesMetadata.value.filter( item => item.id === generalContentItem.cover_img_metadata)

                        if (coverImgMd?.length){
                            backgroundImage.value = coverImgMd[0].image_url
                        }
                        else{
                            console.error('no imagesMetadatamage metadata for footer cover')
                        }

                        let homeButtonImg = imagesMetadata.value.filter( item => item.id === generalContentItem.home_button_img_metadata)

                        if (homeButtonImg?.length){
                            let homeAnchor = localMenuItems.value.filter(item => item.text === 'home')

                            if (homeAnchor?.length){
                                homeAnchor[0].image = homeButtonImg[0].image_url

                            }
                            else{
                                console.error('footer home anchor is not found in array.')
                            }

                        }
                        else{
                            console.error('no image for home button was found')
                        }
                    }
                })
            }

        });


        return { localMenuItems, backgroundImage }
    }
}
</script>

<style>

.bg-cover {
  background-size: cover;
  background-position: center 50%;
  width: 100%;
  aspect-ratio: 16 / 2 ; 
}




</style>