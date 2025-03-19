<template>
  <div class="my-10 mx-10 md:mx-40 flex flex-col gap-16">
    <!-- first part -->
    <div class="grid grid-cols-[3fr_2fr] gap-10">

        <!-- inage -->
         <div class="rounded-3xl overflow-hidden">
            <img :src=blogCoverImage class="h-full object-cover" alt="">
         </div>
         <!-- header and icons -->
        <div class="flex flex-col items-center justify-between  self-end place-self-end gap-10">
            <div class="flex flex-col  gap-10 justify-center text-center">
                <p class="mega-title text-center leading-tight">יוצאים מהמגירה</p>
                <p class="section-title-main text-center justify-self-start">כאן, בין המילים, אני מנסה ללכוד רגעים -

את החולף, את החמקמק, את הפלא שבשינוי ובשגרה. בין כוס קפה בשוק קטן לרגעי שקט מול הים, אני משוטטת ומשאירה עקבות קלילים בסמטאות, לוגמת את רחשי הרחוב, משתהה אל מול היופי הרגעי ומניחה לשאלות להתקיים מסביבי.</p>
            </div>
            <div class="w-[40%] flex justify-center">
                    <BlogCategoryIcons iconBg="beige" :vertical="true" class="max-w-full" @blogCategoryClicked="handleCategory"/>
            </div>
        </div>
    </div>
    <div v-if="tagsDocuments">
        <TagsIcons :tagsDocuments="tagsDocuments" @tagToggled="handleToggledTags"/>
    </div>
    <!-- thirs part blogs -->
     <div class="bg-gray-background -mx-10 md:-mx-40"> <!-- apply negative margin for cover all screen with background -->
        <div class="my-10 mx-10 md:mx-40">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-16">
                <div v-for="blog in visibleBlogs" :key="blog.id" class="bg-background-site rounded-3xl">
                    <router-link :to="{ name: 'Single-Blog', params: { id: blog.id }}">
                        <div class="flex flex-col gap-5">
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
            <button @click="loadMoreBlogs" class="btn">
                Display More
            </button>
        </div>
     </div>
  </div>
</template>

<script setup>

import { ref, computed, defineProps, watchEffect} from 'vue';

import BlogCategoryIcons from '@/components/BlogCategoryIcons.vue';
import TagsIcons from '@/components/TagsIcons.vue';
import useBlogDataSorting from '@/composables/getSortedBlog';
import getCollection from '@/composables/getCollection';
import useImageMetadata from '@/composables/fetchImageMetadata'
import useGeneralContentMetadata from '@/composables/fetchGeneralContent';


const props = defineProps({
    language: String
})

const selectedLang = ref(props.language || "he")

const { imagesMetadata, error : errorImageMd, getMainImageUrl, getImageUrl } = useImageMetadata();
const { sortedBlogData : blogDocuments, error : errorBlogDocs, setCategory, setTags } = useBlogDataSorting()
const { documents : tagsDocuments , error : errorTagDocs, fetchCollectionOnce : fetchCollectionOnceTags } = getCollection("tags")

const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()

fetchCollectionOnceTags()

// Pagination state
const blogsToShow = ref(3); // Start with 9 blogs

// Computed property to get visible blogs
const visibleBlogs = computed(() => {console.log('computed', blogDocuments?.value); return blogDocuments?.value?.slice(0, blogsToShow.value)});


// Function to load more blogs (adds 3 more)
const loadMoreBlogs = () => {
  blogsToShow.value += 3;
};

const getMainImageSrc = (blog) => {
    if (!blog?.default?.images_metadata?.length) {
        console.warn("No images metadata available");
        return "";
    }

    let mainImages = getMainImageUrl(blog.default?.images_metadata)

    return mainImages;
};

const blogCoverImage = computed(() => {

    if (imagesMetadata?.value?.length && generalContentMetadata?.value?.get("blog")){
        let generalContentItem = generalContentMetadata.value.get("blog")
        return  getImageUrl(generalContentItem.common_data?.images_metadata?.cover)
    }

    return ""
})

const handleCategory = (id) => {
    if (id === 0){
        setCategory([])
    }
    else{
        setCategory(id)
    }
}

const handleToggledTags = (ids) => {
    console.log('toggled tags ids', ids)

    setTags(ids)
}

</script>

<style>

</style>