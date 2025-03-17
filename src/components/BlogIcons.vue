<template>
        <div :class="layoutClasses">
            <div v-for="(topic, index) in blogCategories" :key="index" :class="bgClass" class="btn hover:bg-menu-button hover:shadow-[10px_10px_20px_0px_rgba(0,0,0,0.2)] 
            aspect-square flex flex-col justify-center gap-2 md:gap-5 items-center rounded-2xl"
            >
                
                <!-- Image Wrapper -->
                <div class="md:w-1/3  w-1/3  flex justify-center items-center">
                    <img :src="topic.image" class="h-full w-full object-fill" :alt="topic.label">
                </div>

                <!-- Title -->
                <p class="header-title text-background-site"> {{ topic.label }} </p>
            </div>
        </div>
</template>


<script>
import { computed, onMounted, watchEffect, ref } from 'vue';
import useImageMetadata from '@/composables/fetchImageMetadata'
import useGeneralContentMetadata from '@/composables/fetchGeneralContent';
import { doc } from 'firebase/firestore';

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
    setup(props){
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

                    console.log("blog",docs)

                    blogCategories.value = []

                    docs.forEach(category => {
                        let imageUrl = getImageUrl(category.default.images_metadata[0].metadata_id)

                        blogCategories.value.push(
                            {
                                label: category?.translations?.he?.title,
                                image: imageUrl
                            }
                        )
                    })
                }
        });

        // Computed property for layout class
        const layoutClasses = computed(() => {
        return props.vertical 
            ? 'flex flex-col gap-6 items-center justify-center'
            : 'grid grid-cols-3 gap-6 items-center justify-center';
        });

        return { layoutClasses, bgClass, blogCategories }
    }
}
</script>

<style>

</style>