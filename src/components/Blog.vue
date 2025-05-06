<template>
    <div>

        <div class="w-full bg-cover bg-top" dir="rtl"
            :style="{ backgroundImage: `url(${backgroundSrc})` }">
            <div class="padding-half-section grid grid-cols-12 w-full h-auto pt-[30%] md:pt-[25%] pb-[5%]"> 
                <!-- Left part (Cat Image) -->
                <div class="col-start-2 col-span-10">
                    <router-link to="/blog">
                        <p class="text-twenty-seven-px md:text-[54px] text-black-light leading-none font-black">יוצאים <br> מהמגירה</p>
                    </router-link>
                    
                </div>
                <div class="col-start-2 col-span-12">
                    <p class="text-section text-black-light">מילים ומחשבות על מסע החיים</p>
                </div>
                <div class="col-span-10 col-start-2 md:col-start-4 pt-[5%] md:col-span-6">
                    <BlogCategoryIcons class="w-full" iconBg="white" hoverBgColor="yellow-site" :vertical="false" @blogCategoryClicked="handleCategory"/>
                </div>
            </div>
        </div>
        <!-- blog scroller -->
        <div v-if="convertedItems" class="my-[6%]">
            <Scroller :items="convertedItems" :itemWidth="18" :itemGap="2">
                <template v-slot:default="{ item }">
                    <router-link :to="{ name: 'Single-Blog', params: { id: item.id }}" class="w-full h-full">
                        <div class="absolute max-w-full w-full max-h-1/4 h-1/4 top-[67%] px-[10%] mx-auto flex flex-wrap items-center justify-center bg-white">
                            <p class="text-center break-words whitespace-normal ">{{ item.title }}</p>
                        </div>
                    </router-link>
            </template>
            </Scroller>
        </div>
    </div>
</template>
    
<script>

import { watchEffect, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import BlogCategoryIcons from './BlogCategoryIcons.vue';
import Scroller from './Scroller.vue';

import useImageMetadata from '@/composables/fetchImageMetadata';
import getCollection from '@/composables/getCollection';
import useGeneralContentMetadata from '@/composables/fetchGeneralContent';

export default {
    components: {
        BlogCategoryIcons,
        Scroller
    },
    setup(){
        const { documents, error, fetchCollectionOnce } = getCollection("blog");
        fetchCollectionOnce()

        const { imagesMetadata, error: errorImagesMetadata, getImageUrlByRole, getMainImageUrl } = useImageMetadata();
        const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()

        const titleImgSrc = ref(null)
        const backgroundSrc = ref(null)

        const convertedItems = ref(null)

        const router = useRouter()
        
        watchEffect( async () => {
            convertedItems.value = []

            if (!documents.value){
                return;
            }

            documents.value.forEach(doc => {
                convertedItems.value.push( { image: getMainImageUrl(doc.default.images_metadata), title: doc.translations.he?.title, id: doc.id })
            });

            if (imagesMetadata?.value?.length && generalContentMetadata?.value?.get("blog")){
                let generalContentItem = generalContentMetadata.value.get("blog")
                titleImgSrc.value = getImageUrlByRole(generalContentItem.common_data?.images_metadata, "title")
                backgroundSrc.value = getImageUrlByRole(generalContentItem.common_data?.images_metadata, "background")
            }

        });

        const handleCategory = (id) => {

            router.push( { name: "Blog" } )
        }

        return { convertedItems, handleCategory, titleImgSrc, backgroundSrc }
    }
    


}
</script>

<style>

.title-overlay {
  justify-content: center;
  text-align: center;
  font-size: 40px;
  font-weight: bold;
  white-space: normal;  /* ✅ Allow text to wrap to multiple lines */
  word-wrap: break-word; /* ✅ Ensure long words break if needed */
  overflow-wrap: break-word; /* ✅ Alternative for compatibility */
}


</style>