<template>
    <div class="w-full text-right">
        <div class="mt-12">
            <h2 class="text-4xl md:text-6xl font-bold text-background-site" > רואים אור / יוצאים מהמגירה</h2>
        </div>

        <div class="w-3/4 mx-auto h-full mt-6">
            <BlogIcons :icons="topics" :vertical="false"/>
        </div>
        <!--  images title gird -->
    </div>

</template>
  
<script>
import getCollection from "@/composables/getCollection";

import BlogIcons from './BlogIcons.vue';

import { onMounted, ref, watchEffect } from 'vue';
import useImageMetadata from '@/composables/fetchImageMetadata' 

export default {
    components: {
        BlogIcons
    },
    setup(){
        
        const { imagesMetadata, error } = useImageMetadata();
        
        const { error: errorGetCollection, documents: topics, subscribeToCollection } = getCollection("blog_categories");

        onMounted(() =>{
            subscribeToCollection()
        })

        watchEffect(() => {
            if (topics?.value?.length && imagesMetadata?.value?.length) {
                topics.value.forEach(topic => {
                    
                    let matchingImages = imagesMetadata.value.filter(item => item.id === topic.image_metedata);

                    if (matchingImages.length) {
                        topic.image_url = matchingImages[0].image_url;
                    }

                    else{
                        console.log('no image for blog item :', topic.title)
                    }
                });
            }
        });

        return { topics }
    }


}
</script>

<style>

</style>