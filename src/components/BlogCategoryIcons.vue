<template>
    <div :class="layoutClasses">
        <div v-for="topic in blogCategories" @click="handleCategoryClick(topic.id)" :key="topic.id" 
                :class="[
                { 
                    'bg-menu-button': toggled[topic.id], 
                    'shadow-[10px_10px_20px_0px_rgba(0,0,0,0.2)]': toggled[topic.id]
                }
                ]"
                class=" bg-contact-me-bg btn aspect-square flex flex-col justify-center items-center rounded-2xl">
            <!-- Image Wrapper -->
            <div class="md:w-1/2  w-1/2  flex justify-center items-center">
                <img :src="topic.image" class="h-full w-full object-fill" :alt="topic.label">
            </div>

            <!-- Title -->
            <p class="header-title text-background-site"> {{ topic.label }} </p>
        </div>
    </div>
</template>


<script>
import { computed, onMounted, watchEffect, ref, emit } from 'vue';
import useImageMetadata from '@/composables/fetchImageMetadata'
import useGeneralContentMetadata from '@/composables/fetchGeneralContent';
import useSelectorToggle from '@/composables/useSelectorToggle';

export default {
    props: {
        vertical: {
            type: Boolean,
            required: true
        },
        iconBg: {
            type: String,
            required: false,
            default: 'black'
        }
    },
    
    emit: ["blogCategoryClicked"],
    
    setup(props, { emit }){
        const { toggled, initializeToggled, handleClick } = useSelectorToggle([], "blogCategoryClicked")
        
        const bgClass = ref(null)

        const blogCategories = ref([]);

        const { imagesMetadata, error, getImageUrl } = useImageMetadata();
        const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()

        onMounted(() =>{
            bgClass.value = props.iconBg === 'black' ? 'bg-contact-me-bg' : 'bg-projects-cards'
        })

        watchEffect(() => {
            if (imagesMetadata?.value?.length && generalContentMetadata?.value?.get("blog")?.categories){
                    const docs = generalContentMetadata?.value?.get("blog").categories

                    blogCategories.value = []
                    
                    initializeToggled(blogCategories.value.map(category => category.id));

                    docs.forEach(category => {
                        let imageUrl = getImageUrl(category.default.images_metadata[0].metadata_id)

                        blogCategories.value.push(
                            {
                                label: category?.translations?.he?.title,
                                image: imageUrl,
                                id: category.id
                            }
                        )
                    })
                }
        });

        // Computed property for layout class
        const layoutClasses = computed(() => {
        return props.vertical 
            ? 'flex flex-col gap-6 items-center justify-center'
            : 'grid grid-cols-3 gap-10 items-center justify-center';
        });

        const handleCategoryClick = (id) => {
          handleClick(id, emit);
        };

        return { layoutClasses, bgClass, blogCategories, handleCategoryClick, toggled }
    }
}
</script>

<style>

</style>