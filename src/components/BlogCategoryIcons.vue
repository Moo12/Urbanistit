<template>
    <div :class="layoutClasses">
        <div v-for="topic in blogCategories" @click="handleCategoryClick(topic.id)" :key="topic.id" 
                :class="[
                { 
                    'bg-yellow-site': toggled[topic.id], 
                    'shadow-[10px_10px_20px_0px_rgba(0,0,0,0.2)]': toggled[topic.id],
                },
                bgClass,
                `hover:bg-${hoverBgColor}`
                ]"
                class="cursor-pointer aspect-square flex flex-col justify-center items-center rounded-full pt-2">
            <!-- Image Wrapper -->
            <div class="md:w-1/2  w-1/2  flex justify-center items-center">
                <img :src="topic.image" class="w-full aspect-square  object-fill" :alt="topic.label">
            </div>

            <!-- Title -->
            <p class="text-[12px] md:text-section font-black"
            :class="{
                'text-black-light' : isLightBg,
                'text-white' : !isLightBg,

            }"> {{ topic.label }} </p>
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
        },
        hoverBgColor: {
            type: String,
            required: false,
            default: 'transparent'
        },
    },
    
    emit: ["blogCategoryClicked"],
    
    setup(props, { emit }){
        const { toggled, initializeToggled, handleClick } = useSelectorToggle([], "blogCategoryClicked")
        
        const bgClass = ref(null)
        
        const blogCategories = ref([]);

        const { imagesMetadata, error, getImageUrl } = useImageMetadata();
        const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()

        // Define colors considered dark & light
        const darkColors = ["black", "black-light", "gray-900", "gray-800", "brown-site"];
        const lightColors = ["white", "beige", "gray-100", "gray-200"];

        const isLightBg = computed(() => {
            const bg = props.iconBg.replace('bg-', ''); // Normalize input
            return !darkColors.includes(bg); // True for light, False for dark
        });

        // **Function to select the best image based on background color**
        const selectBestImage = (images) => {
           if (!images || images.length === 0) return null;

           // Try to find an image with the opposite color contrast
           let suitableImage = images.find(img => 
               (!isLightBg.value && img.color === 'white') || 
               (isLightBg.value && img.color === 'black')
           );
           console.log("suitableImage", suitableImage)


           // Fallback: If no match is found, return the first image
           return suitableImage || images[0];
       };

       onMounted(() =>{
            bgClass.value = props.iconBg === 'black' ? 'bg-black-light' : `bg-${props.iconBg}`
        });

        watchEffect(() => {
            if (imagesMetadata?.value?.length && generalContentMetadata?.value?.get("blog")?.categories){
                    const docs = generalContentMetadata?.value?.get("blog").categories

                    blogCategories.value = []
                    
                    initializeToggled(blogCategories.value.map(category => category.id));

                    docs.forEach(category => {
                        const selectedImage = selectBestImage(category.default.images_metadata);

                        let imageUrl = getImageUrl(selectedImage?.metadata_id);


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
            : 'grid grid-cols-3 gap-[12%] items-center justify-center';
        });

        const handleCategoryClick = (id) => {
          handleClick(id, emit);
        };



        return { layoutClasses, bgClass, blogCategories, handleCategoryClick, toggled, isLightBg }
    }
}
</script>

<style>

</style>