<template>
    <div class="flex flex-col gap-16">
        <!-- first part -->
        <div class="grid grid-cols-12 gap-2 md:gap-8 padding-section">
            <!-- image -->
            <div v-if="!isMobile" class="col-span-12 md:col-span-7 overflow-hidden md:-ml-20 lg:-ml-40">
                <img :src=blogCoverImage class="w-full  object-cover aspect-[0.8] object-[center_90%]" alt="">
            </div>
               <!-- header and icons -->
            <div class="col-span-12 md:col-span-5 flex flex-col items-end justify-start gap-12 pt-20  md:pt-16">
                <p class="text-[27px] md:text-fifty-four-px font-black w-full text-center md:text-right leading-tight">יוצאים מהמגירה</p>
                <p class="section-content text-right justify-self-start">כאן, בין המילים, אני מנסה ללכוד רגעים -
    
    את החולף, את החמקמק, את הפלא שבשינוי ובשגרה. בין כוס קפה בשוק קטן לרגעי שקט מול הים, אני משוטטת ומשאירה עקבות קלילים בסמטאות, לוגמת את רחשי הרחוב, משתהה אל מול היופי הרגעי ומניחה לשאלות להתקיים מסביבי.</p>
                <!-- image -->
                <div v-if="isMobile" class="overflow-hidden -mx-20">
                    <img :src=blogCoverImage class="w-full  object-cover aspect-[0.8] object-[center_90%]" alt="">
                </div>
                <BlogCategoryIcons iconBg="brown-site" :vertical="false" class="max-w-full" @blogCategoryClicked="handleCategory"/>

                <div v-if="tagsDocuments" class="mt-auto">
                    <TagsIcons :tagsDocuments="tagsDocuments" @tagToggled="handleToggledTags"/>
                </div>
            </div>
        </div>
        <!-- second part part blogs -->
        <div class="bg-gray-background padding-section py-16"> <!-- apply negative margin for cover all screen with background -->
            <div class="grid grid-cols-3 gap-4 md:gap-16">
                <div v-for="blog in visibleBlogs" :key="blog.id" class="bg-white rounded-md aspect-[0.8]">
                    <router-link :to="{ name: 'Single-Blog', params: { id: blog.id }}">
                        <div class="flex flex-col h-full w-full items-center justify-around">
                            <div class="w-[86%] overflow-hidden rounded-md">
                                <img :src="getMainImageSrc(blog)" alt="" class="object-cover w-full aspect-square">
                            </div>
                            <div class="flex flex-wrap justify-center">
                                <p class="text-[14px] md:text-section text-center font-black leading-1">{{blog?.translations[selectedLang]?.title}}</p>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
              <!-- "Display More" Button -->
            <div class="w-full" >
                <div class="flex w-full justify-center mt-6">
                    <button v-if="visibleBlogs?.length < blogDocuments?.length" @click="loadMoreBlogs" class="btn min-h-full">
                        <!-- Full arrow with shaft (Heroicons) -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 48" stroke-width="3" stroke="currentColor" class="w-5 h-20">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 25l-7 7m0 0l-7-7m7 7V0" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div id="contactme_section" class="my-[3.7%]">
      <ContactMeWrapper/>
    </div>
</template>

<script setup>

import { ref, computed, defineProps, onMounted} from 'vue';

import BlogCategoryIcons from '@/components/BlogCategoryIcons.vue';
import TagsIcons from '@/components/TagsIcons.vue';
import useBlogDataSorting from '@/composables/getSortedBlog';
import getCollection from '@/composables/getCollection';
import useImageMetadata from '@/composables/fetchImageMetadata'
import useGeneralContentMetadata from '@/composables/fetchGeneralContent';
import ContactMeWrapper from '@/components/ContactMeWrapper.vue';


const props = defineProps({
    language: String
})

const selectedLang = ref(props.language || "he")

const { imagesMetadata, error: errorImagesMetadata, getImageUrlByRole, getMainImageUrl } = useImageMetadata();
const { sortedBlogData : blogDocuments, error : errorBlogDocs, setCategory, setTags } = useBlogDataSorting()
const { documents : tagsDocuments , error : errorTagDocs, fetchCollectionOnce : fetchCollectionOnceTags } = getCollection("tags")

const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()

const isMobile = ref(null)

fetchCollectionOnceTags()

onMounted(() => {
    isMobile.value = window.innerWidth > 768 ? false : true
})

const ellipseStyle = computed(() => { //to fix
    return {
        width: "100%",    // Full width
        height: "100%",    // Half of the full oval height
        borderTopLeftRadius: "100% 100%",  // Curved top-left
        borderBottomLeftRadius: "100% 100%", // Curved bottom-left
        borderTopRightRadius: "0 0", // Keep right side flat
        borderBottomRightRadius: "0 0", // Keep right side flat
        overflow: "hidden",
    };
});

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
        return getImageUrlByRole(generalContentItem.common_data?.images_metadata, "cover")
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