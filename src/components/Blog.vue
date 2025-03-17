<template>
    <div class="w-full text-right padding-section flex flex-col gap-16">
        <router-link to="/blog">
            <div class="btn">
                <p class="header-title text-contact-me-bg">
                 יוצאים מהמגירה
                </p>
            </div>
        </router-link>

        <div class="grid grid-cols-[1fr_3fr_1fr]">
            <div class="col-start-2 col-span-1">
                <BlogIcons iconBg="beige" :vertical="false"/>
            </div>
        </div>
        <!--  images title gird -->

        <Scroller :items="convertedItems"></Scroller>
    </div>

</template>
    
<script>

import { watchEffect, ref } from 'vue';

import BlogIcons from './BlogIcons.vue';
import getCollection from '@/composables/getCollection';
import Scroller from './Scroller.vue';

import useImageMetadata from '@/composables/fetchImageMetadata';


export default {
    components: {
        BlogIcons,
        Scroller
    },
    setup(){
        const { documents, error, fetchCollectionOnce } = getCollection("blog")
        const { imagesMetadata, error: errorImagesMd, getImageUrl } = useImageMetadata();

        const convertedItems = ref(null)

        fetchCollectionOnce()

        
        watchEffect( async () => {
            convertedItems.value = []

            if (!documents.value){
                return;
            }

            documents.value.forEach(doc => {
                convertedItems.value.push( { image: getImageUrl(doc.default.images_metadata[0].metadata_id), title: doc.translations.he?.title, id: doc.id })
            });
    
        });

        return { convertedItems }
    }
    


}
</script>

<style>

</style>