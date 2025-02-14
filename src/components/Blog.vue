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
import useImageMetadata from '@/composables/getImageMetadata'

export default {
    components: {
        BlogIcons
    },
    setup(){

        const { error: errorGetCollection, documents: topics, subscribeToCollection } = getCollection("Blogs");

        const { metadata, error, loading, fetchMetadata } = useImageMetadata();


        
        onMounted(() =>{
            subscribeToCollection()

            fetchMetadata("blog")
        })

        watchEffect(() => {
        if (topics.value && topics.value.length && metadata.value && metadata.value.length) {
            topics.value.forEach(topic => {
                const matchingMeta = metadata.value.filter(meta => 
                    meta.sub_section === topic.identifier && meta.role === "main"
                );

                if (matchingMeta.length === 1) {
                    topic.source = matchingMeta[0].image_url;
                } else if (matchingMeta.length > 1) {
                    topic.source = matchingMeta[0].image_url; // Take the first item
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