<template>
    <div class="padding-section">
        <div class="w-full text-right flex flex-col items-center justify-center gap-6">
            <router-link to="/blog">
                <div class="btn">
                    <p class="mega-title leading-tight text-contact-me-bg">
                     יוצאים מהמגירה
                    </p>
                </div>
            </router-link>
            
            <div class="flex justify-center">
                <BlogCategoryIcons class="w-1/2" iconBg="black" :vertical="false" @categoryClicked="handleCategory"/>
            </div>
            <!--  images title gird -->
        </div>

        <Scroller class="mt-32" :items="convertedItems"></Scroller>
    </div>

</template>
    
<script>

import { watchEffect, ref } from 'vue';

import BlogCategoryIcons from './BlogCategoryIcons.vue';
import useBlogDataSorting from '@/composables/getSortedBlog';
import Scroller from './Scroller.vue';

import useImageMetadata from '@/composables/fetchImageMetadata';


export default {
    components: {
        BlogCategoryIcons,
        Scroller
    },
    setup(){
        const { sortedBlogData : documents, error : errorBlogDocs, setCategory, setTags } = useBlogDataSorting()

        const { imagesMetadata, error: errorImagesMd, getMainImageUrl } = useImageMetadata();

        const convertedItems = ref(null)
        
        watchEffect( async () => {
            convertedItems.value = []

            if (!documents.value){
                return;
            }

            documents.value.forEach(doc => {
                convertedItems.value.push( { image: getMainImageUrl(doc.default.images_metadata), title: doc.translations.he?.title, id: doc.id })
            });
    
        });

        const handleCategory = (id) => {
            if (id === 0){
                setCategory([])
            }
            else{
                setCategory(id)
            }
        }

        return { convertedItems, handleCategory }
    }
    


}
</script>

<style>

</style>