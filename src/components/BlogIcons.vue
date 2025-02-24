<template>
    <div class="flex content-center justify-center">
        <div :class="layoutClasses">
            <div v-for="(topic, index) in blogCategories" :key="index" :class="bgClass" class="btn hover:bg-menu-button hover:shadow-[10px_10px_20px_0px_rgba(0,0,0,0.2)] 
            aspect-square m-1 md:m-16 flex flex-col justify-center items-center p-3 rounded-3xl ">
                
                <!-- Image Wrapper -->
                <div class="md:w-2/3 md:h-2/3 w-1/2 h-1/2 flex justify-center items-center">
                    <img :src="topic.image" class="h-full w-full object-contain" :alt="topic.label">
                </div>

                <!-- Title -->
                <h2 class="md:mt-4 header-title text-background-site"> {{ topic.label }} </h2>
            </div>
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
            console.log()

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


                        console.log('blog categories', blogCategories.value)

                        blogCategories.value.forEach(category => {
                            if (category.image_metadata !== '') {
                                let imgMetadata = imagesMetadata.value.filter(img => img.id === category.image_metadata);

                                if (imgMetadata.length) {
                                    category.image = imgMetadata[0].image_url;

                                    console.log('add image to : ', category.label)
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
            ? 'flex flex-col' 
            : 'grid grid-cols-[repeat(3,_1fr)]';
        });

        // Computed property for image wrapper classes
        const imageWrapperClasses = computed(() => {
        return props.vertical 
            ? 'md:w-2/3 md:h-2/3 w-1/2 h-1/2 flex justify-center items-center'
            : 'flex justify-center items-center md:w-2/3 md:h-2/3 w-1/2 h-1/2';
        });



        return { layoutClasses, bgClass, blogCategories}
    }
}
</script>

<style>

</style>