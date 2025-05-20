<template>
  <div v-if="!errrorLoadBlogDoc && blogDoc" class="flex flex-col md:mx-[45px] mx-[30px]">
    <!-- layout -->
    <div class="bg-white">
        <div v-if="isLandscape !== null" ref="containerRef"
        class="border-background-site h-[90vh] mt-[50px]  border-[30px]" dir="rtl"
        :class="[mainImgAndTitleLayoutClass, {'border-b-0': isLandscape }]">
            <!-- category title -->
            <div class="flex flex-col items-center  gap-3 flex-wrap">
                <div class="flex items-center justify-center gap-2 my-6">
                    <div class="w-[50px] h-[1px]  bg-black-light"></div>
                    <span class="section-content tracking-wide">{{ selectedCategory }}</span>
                    <div class="w-[50px] h-[1px] bg-black-light"></div>
                </div>

                <p class="text-[27px] md:text-fifty-four-px font-black text-center"> {{ blogDoc.translations.he.title }}</p>
            </div>
            <!-- image -->
            <div 
                class="ml-[-75px] h-full"
                    :class="[{ 'mt-[-30px]' : !isLandscape },
                            {'mr-[-75px] mb-[-30px]' :  isLandscape }
                    ]"
                    >
                    <div class="" v-if="ratio">
                        <BlogItemMainLayuot  :aspectRatio="ratio" :imageSrc="mainImageUrl" :isLandscape="isLandscape"/>
                    </div>
            </div>
        </div>
    </div>
    
        <!-- navigate -->
    <div class="mt-10 padding-half-section flex justify-between">
        <div class="btn">
            <p class="font-light">תאריך עלייה לאתר</p>
        </div>
        <router-link :to="{ name: 'Blog'}">
            <div class="btn font-light">
                <p class="font-light">חזרה לעמוד הקודם</p>
            </div>
        </router-link>
    </div>


    <!-- sub title -->
    <div v-if="isBlogContentLoaded" class="mt-10">
        <BlogContent :blogItem="blogContent"></BlogContent>
    </div>
    <div class="w-full mt-10">
        <Scroller :items="galleryImgs" :itemWidth="25" :itemGap="1.4"
        @click="(item) => { isGalleryOpen = true; currentGalleryImageIndex = item.index }"
        >
        </Scroller>
    </div>
    <div v-if="isGalleryOpen">
        <ScrollerModel :images="galleryImgs" :index="currentGalleryImageIndex"  @close="isGalleryOpen = false"/>
    </div>
  </div>
  <div v-else-if="errrorLoadBlogDoc">
    FATAL ERROR couldnt load blog
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect, computed } from 'vue';
import BlogItemMainLayuot from '@/components/BlogItemMainLayuot.vue';
import BlogContent from '@/components/BlogContent.vue';
import Scroller from '@/components/Scroller.vue';
import ScrollerModel from '@/components/ScrollerModel.vue';

import getCollection from '@/composables/getCollection'
import getDocument from '@/composables/getDocument';
import useGeneralContentMetadata from '@/composables/fetchGeneralContent';
import useImageMetadata from '@/composables/fetchImageMetadata'

import { getSelectedOptionValue } from "@/composables/useOptions"
import { useRoute } from 'vue-router';

const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()
const { imagesMetadata, error, getMainImageUrl, getImagesUrlByRole, getImageUrlByRole } = useImageMetadata();


const route = useRoute();
const id = ref(route.params.id)

console.log("blog id", id.value)

const selectedCategory = ref("")

const selectedTags = ref([])

const language = "he"

const mainImageUrl = ref(null)

const { documents : tagsDocuments , error : errorTagDocs, fetchCollectionOnce : fetchTagsCollectionOnce } = getCollection("tags")

const { error: errrorLoadBlogDoc, document : blogDoc} = getDocument("blog", id.value)

const isLandscape = ref(null); // To determine layout
const ratio = ref(null)

const isGalleryOpen = ref(false)
const currentGalleryImageIndex = ref(0)

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

const containerRef = ref(null)

const galleryImgs = ref([])

const blogContent = ref({
  main_image: {
    type : "",
    src: "",
  },
  galleryImagesUrls: [],

  sub_title: '',
  content: ''
})

const isBlogContentLoaded = ref(false)

onMounted( async () => {
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
            galleryImgs.value = getImagesUrlByRole(blogDoc.value.default.images_metadata, "gallery")?.map((item, index) => {
                return { image: item.url, index: index }
            })

            let postMedia = getImagesUrlByRole(blogDoc.value.default.images_metadata, "post")?.[0]
            blogContent.value.main_image.type = postMedia?.type
            blogContent.value.main_image.src = postMedia?.url

            console.log("blogContent.value.main_image", blogContent.value.main_image)



            if ( isLandscape.value === null){
                ratio.value = await getImageAspectRatio(mainImageUrl.value);
                
                isLandscape.value = ratio.value > 1;

                let _width, _height

                _width = window.innerWidth
                _height = window.innerHeight 

                ratio.value = isLandscape.value ? _width / (_height * 0.7)  : ratio.value
                
                console.log(`containerAspect ${ratio.value} height ${_height} _width ${_width}`)
                console.log("isLandscape", isLandscape.value)
            }

            blogContent.value.sub_title = blogDoc.value.translations.he.sub_title
            blogContent.value.content = blogDoc.value.translations.he.content


            isBlogContentLoaded.value = true
        }
    }
})

const mainImgAndTitleLayoutClass = computed(() => {
    if (isLandscape.value !== null){
        return isLandscape.value ? "flex flex-col" :  "grid grid-cols-[6fr_4fr]"
    }
})

</script>

<style>

</style>