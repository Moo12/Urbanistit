<template>
    <div class="w-full flex flex-col gap-4 padding-section">
        <div class="justify-center items-center" :class = "[containerClass]">
            <!-- horizontal anchors-->
            <div v-for="(item, index) in orderedMenuItems" :key="index" class="flex items-center justify-center btn h-full">
                <a :href="item.href" class="no-underline flex justify-center items-center">
                    <img v-if="item.image" :src="item.image" alt="item.label" class="w-full md:w-1/3 aspect-square" />
                    <p v-else class="text-[14px] md:text-section font-black text-center text-black-light">{{ item.label }}</p>
                </a>
            </div>
        </div>
        <div class="flex flex-col md:flex-row justify-center md:gap-5 items-center" dir="rtl">
            <p class="text-[12px]">
  האתר עוצב ונבנה ב<i class="fas fa-heart text-black-light mx-1"></i>
  .ע"י מאיה ומעין
    </p>
    <p class="text-[12px]">כל הזכויות שמורות. הצהרת נגישות</p>
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

        const containerClass = ref('')
        
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
                    })

                    containerClass.value =  `grid grid-cols-${localMenuItems.value?.length}`
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

        return { backgroundImage, orderedMenuItems, containerClass }
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