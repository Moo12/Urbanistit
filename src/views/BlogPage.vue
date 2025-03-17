<template>
  <div class="m-10 flex flex-col gap-16">
    <!-- first part -->
    <div class="grid grid-cols-[3fr_2fr]">

        <!-- inage -->
         <div class="h-full rounded-3xl overflow-hidden">
            <img src='img/gur_blog_cover.png' class="h-full object-cover" alt="">
         </div>
         <!-- header and icons -->
        <div class="flex flex-col items-center justify-between gap-10">
            <div class="flex flex-col gap-3 justify-center text-center">
                <p class="header-title">יוצאים מהמגירה</p>
                <p class="header-title-sub">הפשיטו אותי</p>
            </div>
            <div class="grid grid-cols-[1fr_2fr_1fr]">
                <div class="col-start-2 col-span-1">
                    <BlogIcons iconBg="beige" :vertical="true" class="max-w-full"/>
                </div>
            </div>
        </div>
    </div>
    <!-- second part tags -->
    <div class="flex flex-wrap gap-2 md:gap-x-4 md:gap-y-5">
        <div v-for="(tag, index) in tagsDocuments" :key="index" class="rounded-3xl bg-menu-button flex items-center p-3">
            <p class="text-center section-title-main" >{{ tag.translations.en.title }}</p>
        </div>
    </div>
    <!-- thirs part blogs -->
     <div class="bg-gray-background -m-10">
        <div class="m-10">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div v-for="blog in visibleBlogs" :key="blog.id" class="bg-background-site rounded-3xl">
                    <router-link :to="{ name: 'Single-Blog', params: { id: blog.id }}">
                        <div class="flex flex-col">
                            <div class="overflow-hidden square-frame">
                                <img :src="getMainImageSrc(blog)" alt="" class="object-cover w-full h-full">
                            </div>
                            <div class="self-center">
                                <p class="header-title-sub">{{blog?.translations[selectedLang]?.title}}</p>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
        <!-- "Display More" Button -->
        <div class="flex justify-center mt-6" v-if="visibleBlogs?.length < blogDocuments?.length">
            <button @click="loadMoreBlogs" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
                Display More
            </button>
        </div>
     </div>
  </div>
</template>

<script setup>

import { ref, computed, defineProps} from 'vue';

import BlogIcons from '@/components/BlogIcons.vue';
import getCollection from '@/composables/getCollection';
import useImageMetadata from '@/composables/fetchImageMetadata'
import useGeneralContentMetadata from '@/composables/fetchGeneralContent';


const props = defineProps({
    language: String
})

const selectedLang = ref(props.language || "en")

const { imagesMetadata, error : errorImageMd } = useImageMetadata();
const { documents : blogDocuments , error : errorBlogDocs, subscribeToCollection } = getCollection("blog")
const { documents : tagsDocuments , error : errorTagDocs, fetchCollectionOnce : fetchCollectionOnceTags } = getCollection("tags")


subscribeToCollection()
fetchCollectionOnceTags()

// Pagination state
const blogsToShow = ref(3); // Start with 9 blogs

// Computed property to get visible blogs
const visibleBlogs = computed(() => blogDocuments.value?.slice(0, blogsToShow.value));


// Function to load more blogs (adds 3 more)
const loadMoreBlogs = () => {
  blogsToShow.value += 3;
};

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