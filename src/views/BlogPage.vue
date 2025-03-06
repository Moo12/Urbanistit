<template>
  <div class="my-10 mx-10">
    <!-- first part -->
    <div class="grid grid-cols-[3fr_2fr]">

        <!-- inage -->
         <div class="h-full rounded-3xl overflow-hidden">
            <img src='img/gur_blog_cover.png' class="h-full object-cover" alt="">
         </div>
         <!-- header and icons -->
        <div class="flex-col items-center justify-between">
            <div class="flex flex-col gap-3 justify-center text-center">
                <p class="header-title">יוצאים מהמגירה</p>
                <p class="header-title-sub">הפשיטו אותי</p>
            </div>
            <div>
                <BlogIcons iconBg="beige" :vertical="true"/>
            </div>
        </div> 

    </div>  
    <!-- second part tags -->
    <div>

    </div>  
    <!-- thirs part blogs -->
     <div class="bg-red-500 py-10 my-10 mx-5">
         <div v-for="blog in blogDocuments" :key="blog.id">
             <div class="grid grid-cols-2 md:grid-cols-3">
                 <div class="flex flex-col bg-background-site rounded-3xl">
                     <div class="overflow-hidden square-frame">
                         <img :src="getMainImageSrc(blog)" alt="" class="object-cover w-full h-full">
                     </div>
                     <div>
                         <p class="header-title-sub">{{blog?.translations[selectedLang]?.title}}</p>
                     </div>
                 </div>
             </div>
         </div>
     </div>
  </div>
</template>

<script setup>

import { ref, defineProps} from 'vue';

import BlogIcons from '@/components/BlogIcons.vue';
import getCollection from '@/composables/getCollection';
import useImageMetadata from '@/composables/fetchImageMetadata'

const props = defineProps({
    language: String
})


const { imagesMetadata, error : errorImageMd } = useImageMetadata();
const { documents : blogDocuments , error : errorBlogDocs, subscribeToCollection } = getCollection("blog")
subscribeToCollection()

const selectedLang = ref(props.language || "en")

const getMainImageSrc = (blog) => {
    if (!blog?.default?.images_metadata?.length) {
        console.log("No images metadata available");
        return "";
    }

    // Corrected filtering condition: Find image with role 'main'
    let mainImages = blog.default.images_metadata.filter(image_md => image_md.role === 'main');

    console.log("mainImages", mainImages);

    if (mainImages.length) {
        let mainImageMt = imagesMetadata.value.find(item => item.id === mainImages[0].metadata_id);
        
        if (mainImageMt) {
            return mainImageMt.image_url;
        } else {
            console.log("Image metadata not found for ID", mainImages[0].metadata_id);
        }
    } else {
        console.log("No main images found");
    }

    return "";
};

</script>

<style>

</style>