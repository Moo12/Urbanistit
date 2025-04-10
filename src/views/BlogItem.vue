<template>
  <div v-if="!errrorLoadBlogDoc && blogDoc" class="flex flex-col">
    <!-- layout -->
    <div class="bg-background-site">
        <div v-if="isLandscape !== null" class="bg-white margin-half-section-top margin-half-section" :class="mainImgAndTitleLayoutClass">
            <!-- image -->
            <div class=""
                    :class="[mainImgAdujtmentsLayoutClass]" :style="`aspect-ratio: ${ratio}`">
                <BlogItemMainLayuot  :imageSrc="mainImageUrl" :isLandscape="isLandscape" :aspectRatio="ratio"/>
            </div>
            <!-- category title -->
            <div class="flex flex-col items-center gap-5 flex-wrap">
                <p class="section-content">-------- {{ selectedCategory }} --------</p>
                <p class="text-fifty-four-px font-black "> {{ blogDoc.translations.he.title }}</p>
            </div>
        </div>
    </div>
    
        <!-- navigate -->
    <div class="mt-10 mx-5 flex justify-between">
        <div class="btn">
            תאריך עלייה לאתר
        </div>
        <router-link :to="{ name: 'Blog'}">> 
            <div class="btn">
                חזרה לעמוד הקודם
            </div>
        </router-link>
    </div>



    <!-- sub title -->
    <div class="flex flex-col justify-center items-center gap-5">
        <div class="header-title-sub">
           <p>{{ blogDoc.translations.he.sub_title }}</p>
        </div>
        <div class="section-content">
           <p>{{ blogDoc.translations.he.content }}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            <div v-for="image, index in subImagesUrls" :key="index">
                <img :src="image" alt="">
            </div>
        </div>
    </div>
  </div>
  <div v-else-if="errrorLoadBlogDoc">
    FATAL ERROR couldnt load blog
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect, computed } from 'vue';
import BlogItemMainLayuot from '@/components/BlogItemMainLayuot.vue'; 

import getCollection from '@/composables/getCollection'
import getDocument from '@/composables/getDocument';
import useGeneralContentMetadata from '@/composables/fetchGeneralContent';
import useImageMetadata from '@/composables/fetchImageMetadata'

import { getSelectedOptionValue } from "@/composables/useOptions"
import { useRoute } from 'vue-router';

const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()
const { imagesMetadata, error, getMainImageUrl, getSubImagesUrls } = useImageMetadata();


const route = useRoute();
const id = ref(route.params.id)

console.log("blog id", id.value)

const selectedCategory = ref("")

const selectedTags = ref([])

const language = "he"

const mainImageUrl = ref(null)

const subImagesUrls = ref([])

const { documents : tagsDocuments , error : errorTagDocs, fetchCollectionOnce : fetchTagsCollectionOnce } = getCollection("tags")

const { error: errrorLoadBlogDoc, document : blogDoc} = getDocument("blog", id.value)

const isLandscape = ref(null); // To determine layout
const ratio = ref(null)

  // Function to calculate image aspect ratio
const getImageAspectRatio = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => { 
        console.log("on image load")
      const ratio = img.width / img.height;
      resolve(ratio);
    };
    img.src = src;
  });
};

// On component mount, check the image's aspect ratio

onMounted(async () => {
    
    await fetchTagsCollectionOnce()
})


watchEffect(async () => {
    const categories = generalContentMetadata?.value?.get("blog")?.categories
    if (blogDoc.value){

        if (categories){
            const categoryItem = getSelectedOptionValue(blogDoc.value.default?.category, categories)

            selectedCategory.value = categoryItem.translations?.[language].title
        }
        
        if (tagsDocuments.value?.length){
            selectedTags.value = []
            const tagsSelectedItems = getSelectedOptionValue(blogDoc.value.default?.tags, tagsDocuments.value)
            tagsSelectedItems.forEach(selectedTag => {
                selectedTags.value.push(selectedTag.translations?.en.title)
            });
        }

        if (imagesMetadata?.value?.length){
            mainImageUrl.value = getMainImageUrl(blogDoc.value.default.images_metadata)
            subImagesUrls.value = getSubImagesUrls(blogDoc.value.default.images_metadata)

            if ( isLandscape.value === null){
                ratio.value = await getImageAspectRatio(mainImageUrl.value);
                
                isLandscape.value = ratio.value > 1;
                
                console.log("ratio", ratio.value)
                console.log("isLandscape", isLandscape.value)
            }

        }
    }
})

const mainImgAndTitleLayoutClass = computed(() => {
    if (isLandscape.value !== null){
        return isLandscape.value ? "flex flex-col-reverse" :  "grid grid-cols-[2fr_2fr]"
    }
})

const mainImgAdujtmentsLayoutClass = computed(() => {
    if (isLandscape.value !== null){
        return isLandscape.value ? "ml-[calc(-50vw+50%)] mr-[calc(-50vw+50%)]" :  "ml-[calc(-50vw+50%)]"
    }
})




</script>

<style>

</style>