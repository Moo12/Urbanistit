<template>
    <div class="w-full bg-cover" :style="{ backgroundImage: `url(${backgroundImage})` }">
        
        <!-- content -->
        <div class="w-5/6 mx-auto h-full overflow-hidden" >
            <!-- horizontal anchors-->
            <ul class="flex  h-full flex-row justify-between items-center">
                <li v-for="(item, index) in orderedMenuItems" :key="index" class="btn h-full">
                    <a :href="item.href" class="no-underline h-full flex items-center">
                        <img v-if="item.image" :src="item.image" alt="item.label" class="h-4/5 self-end object-cover" />
                        <p v-else class="section-title-main text-contact-me-bg">{{ item.label }}</p>
                    </a>
                </li>
            </ul>
        </div>

    </div>
  
</template>

<script>
import { onMounted, watchEffect, ref, computed } from 'vue';
import useImageMetadata from '@/composables/fetchImageMetadata'
import useGeneralContentMetadata from '@/composables/fetchGeneralContent';

export default {
    setup(){
        const backgroundImage = ref(null)
        const localMenuItems = ref([]); // Create a reactive copy
        
        const { imagesMetadata, error } = useImageMetadata();
        const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()

        onMounted(() => {
        })

        watchEffect(() => {
            if (imagesMetadata?.value?.length && generalContentMetadata?.value?.get("footer")){
                let generalContentItem = generalContentMetadata.value.get("footer")
                    let coverImgMd = imagesMetadata.value.filter( item => item.id === generalContentItem.common_data?.images_metadata?.cover)

                    if (coverImgMd?.length){
                        backgroundImage.value = coverImgMd[0].image_url
                    }
                    else{
                        console.error('no imagesMetadatamage metadata for footer cover')
                    }

                    localMenuItems.value = generalContentItem.translations?.he?.nav_links?.value

                    localMenuItems.value.forEach(menuItem => {
                        if (menuItem.image_metadata !== '') {
                            let imgMetadata = imagesMetadata.value.filter(img => img.id === menuItem.image_metadata);

                            if (imgMetadata.length) {
                                menuItem.image = imgMetadata[0].image_url;
                            }
                            else{
                                console.error('did not match image for : ', menuItem.label)
                            }
                        }
                    });
                }
            })

        // Ensure "Home" is always in the middle
        const orderedMenuItems = computed(() => {
            let items = [...localMenuItems.value]; // Create a new array to avoid mutation
            let homeIndex = items.findIndex(item => item.id.toLowerCase() === "home");

            if (homeIndex !== -1) {
                let homeItem = items.splice(homeIndex, 1)[0]; // Remove Home
                let middleIndex = Math.floor(items.length / 2); // Get middle index
                items.splice(middleIndex, 0, homeItem); // Insert Home in the middle
            }

            return items;
        });


        return { backgroundImage, orderedMenuItems }
    }
}
</script>

<style>

.bg-cover {
  background-size: cover;
  background-position: center 50%;
  width: 100%;
  aspect-ratio: 40 / 2 ; 
}




</style>