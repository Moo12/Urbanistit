<template>
  <div v-if="!errrorLoadBlogDoc && blogDoc" class="flex flex-col mt-5">
    <!-- category title image -->
    <div class="flex flex-col justify-center items-center gap-5">
        <div>
            <p class="section-title-main">-------- {{ selectedCategory }} --------</p>
        </div>
        <div>
            <p class="header-title"> {{ blogDoc.translations.he.title }}</p>
        </div>

        <!-- main image -->
        <div class="relative w-[80%] mx-auto rounded-t-[50%] overflow-hidden">
            <img :src="mainImageUrl" class="w-full h-[50vh] object-cover " alt="main image">
        </div>
    </div>
    <!-- navigate -->
    <div class="mt-10 mx-5 flex justify-between">
        <div class="btn">
            תאריך עלייה לאתר
        </div>
        <router-link to="/blog"> 
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
        <div class="section-title-main">
           <p>{{ blogDoc.translations.he.content }}</p>
        </div>
    </div>
  </div>
  <div v-else-if="errrorLoadBlogDoc">
    FATAL ERROR couldnt load blog
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from 'vue';

import getCollection from '@/composables/getCollection'
import getDocument from '@/composables/getDocument';
import useGeneralContentMetadata from '@/composables/fetchGeneralContent';
import useImageMetadata from '@/composables/fetchImageMetadata'

import { getSelectedOptionValue } from "@/composables/useOptions"
import { useRoute } from 'vue-router';

const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()
const { imagesMetadata, error, getImageUrl } = useImageMetadata();


const route = useRoute();
const id = ref(route.params.id)

console.log("blog id", id.value)

const selectedCategory = ref("")

const selectedTags = ref([])

const language = "he"

const mainImageUrl = ref("")

const { documents : tagsDocuments , error : errorTagDocs, fetchCollectionOnce : fetchTagsCollectionOnce } = getCollection("tags")

const { error: errrorLoadBlogDoc, document : blogDoc} = getDocument("blog", id.value)

onMounted(async () => {
    await fetchTagsCollectionOnce()
})


watchEffect(() => {
    const categories = generalContentMetadata?.value?.get("blog")?.categories
    if (blogDoc.value){

        if (categories){
            const categoryItem = getSelectedOptionValue(blogDoc.value.default?.category, categories)
            console.log("category id", blogDoc.value.default?.category)
            console.log("categories", categories)
            console.log("categories", categories)

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
            mainImageUrl.value = getImageUrl(blogDoc.value.default.images_metadata[0].metadata_id)

        }
    }


})

</script>

<style>

</style>