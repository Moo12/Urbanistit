<template>
    <div>
        <div class="grid grid-cols-12 w-full padding-section">
            <div class="col-span-5 items-center">
                <BlogCategoryIcons class="w-full" iconBg="white" :vertical="false" @blogCategoryClicked="handleCategory"/>
            </div>
            <!-- Left part (Cat Image) -->
            <div class="col-start-8 col-span-4 items-end flex flex-col">
                <div class="w-full text-right">
                    <router-link to="/blog">
                        <p class="text-fifty-four-px font-bold text-gray-background">יוצאים מהמגירה</p>
                    </router-link>
                </div>
                <div>
                    <p class="text-section font-bold text-gray-background">מילים ומחשבות על מסע החיים</p>
                </div>
            </div>
        </div>
        <div v-if="convertedItems" class="my-16">
            <Scroller :items="convertedItems">
                <template v-slot:default="{ item }">
                    <router-link :to="{ name: 'Single-Blog', params: { id: item.id }}" class="w-full h-full">
                        <div class="absolute w-full h-1/4 top-[50%] flex items-center justify-center bg-gray-background">
                            <div class="title-overlay">
                            <p>{{ item.title }}</p>
                            </div>
                        </div>
                    </router-link>
                </template>
            </Scroller>
        </div>
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

.title-overlay {
  justify-content: center;
  text-align: center;
  font-size: 40px;
  font-weight: bold;
  white-space: normal;  /* ✅ Allow text to wrap to multiple lines */
  word-wrap: break-word; /* ✅ Ensure long words break if needed */
  overflow-wrap: break-word; /* ✅ Alternative for compatibility */
}


</style>