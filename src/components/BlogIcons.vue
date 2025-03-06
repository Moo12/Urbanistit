<template>
        <div :class="layoutClasses" class="h-full w-full">
            <div v-for="(topic, index) in blogCategories" :key="index" :class="bgClass" class="btn hover:bg-menu-button hover:shadow-[10px_10px_20px_0px_rgba(0,0,0,0.2)] 
            aspect-square flex flex-col justify-center gap-5 items-center rounded-2xl m-1 md:m-6"
            :style="computedSizeStyle">
                
                <!-- Image Wrapper -->
                <div class="md:w-1/3  w-1/3  flex justify-center items-center">
                    <img :src="topic.image" class="h-full w-full object-contain" :alt="topic.label">
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

        const { imagesMetadata, error } = useImageMetadata();
        const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()

        onMounted(() =>{
            bgClass.value = props.iconBg === 'black' ? 'bg-contact-me-bg' : 'bg-projects-cards'
        })

        watchEffect(() => {
            if (imagesMetadata?.value?.length && generalContentMetadata?.value?.length){
                generalContentMetadata.value.forEach(generalContentItem => {
                    if (generalContentItem.id === "blog"){

                        
                        blogCategories.value = generalContentItem.translations?.he?.categories?.value
                        if (!blogCategories.value?.length){
                            console.error('blog categories is empty')
                            return;
                        }

                        blogCategories.value.forEach(category => {
                            if (category.image_metadata !== '') {
                                let imgMetadata = imagesMetadata.value.filter(img => img.id === category.image_metadata);

                                if (imgMetadata.length) {
                                    category.image = imgMetadata[0].image_url;

                                }
                                else{
                                    console.error('did not match image for : ', category.label)
                                }
                            }
                        });
                    }
                })
            }
        });

        // Computed property for layout class
        const layoutClasses = computed(() => {
        return props.vertical 
            ? 'flex flex-col gap-6 items-center items-center'
            : 'flex flex-row gap-6 justify-center';
        });

        const computedSizeStyle = computed(() => {
            if (blogCategories.value.length === 0) return {};

            const factor = props.vertical ? 1.6 : 2

            const size = (1 / (blogCategories.value.length * factor)) * 100;

            return props.vertical 
                ? { height: `${size}%` } 
                : { width: `${size}%` };
        });

        return { layoutClasses, bgClass, blogCategories, computedSizeStyle}
    }
}
</script>

<style>

</style>