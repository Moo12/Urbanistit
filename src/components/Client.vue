<template>
    <div v-if="project.isMain" class="btn flex items-center justify-center  bg-contact-me-bg rounded-3xl aspect-square w-full h-full">
        <p class="header-title text-background-site">{{ project.name }}</p>

    </div>
    <div v-else class="md:relative  grid grid-cols-2 gap-4 w-full h-full md:flex md:items-center md:justify-center overflow-hidden"
        @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <!-- first square -->
        <div
            class="project-frame project-relative-layout overflow-hidden"
            :class="{
                'md:invisible md:pointer-events-none': isHovered,
                'md:visible': !isHovered,
            }"
        >
            <img class="object-cover w-full h-full" :src="project.image_url" alt="">
        </div>
        <!-- second frame -->
        <div class="project-frame bg-projects-cards md:project-absolute-layout flex flex-row-reverse items-center justify-center text-right"
            :class="{
                'md:invisible md:pointer-events-none': !isHovered,
                'md:visible': isHovered,
                'project-relative-layout' : screenWidth < 768,
                'project-absolute-layout' : screenWidth >= 768,
 
            }">
            <div class="flex flex-col justify-center items-center content-center">

                <p class="header-title-sub pb-4 border-background-site border-b-4  text-background-site px-2 text-center">{{ project.translations?.he?.title }}</p>
                <div class="flex flex-col mt-4 justify-center content-center">

                    <p class="section-title-main text-center text-background-site"> {{ project.translations?.he?.sub_title }}</p>
                </div>
            </div>
        </div>
    </div>



</template>

<script>
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import useImageMetadata from '@/composables/fetchImageMetadata.js'

export default { 
    props: {
        project: {
            type: Object,
            required: true
        }
    },
    setup(props){
        const language = ref("he")
 
        const screenWidth = ref(window.innerWidth);

        const { imagesMetadata, error: errorUseImageMetadata, getMainImageUrl } = useImageMetadata();

        const updateScreenWidth = () => {
            screenWidth.value = window.innerWidth;
        };

        onMounted(async () => {
            window.addEventListener("resize", updateScreenWidth);
        });

        onUnmounted(() => {
            window.removeEventListener("resize", updateScreenWidth);
        });


        watchEffect(()=>{
            
            if (imagesMetadata?.value?.length && !props.project.isMain ){
                props.project.image_url = getMainImageUrl(props.project.default.images_metadata);
            }
        })

        const isHovered = ref(false)

        const onMouseEnter = () => {
            isHovered.value = true;

        }

        const onMouseLeave = () => {
            isHovered.value = false;
        }

        return {isHovered, onMouseEnter, onMouseLeave, screenWidth, language}
    }

}
</script>

<style>

</style>