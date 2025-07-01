<template>
    <div v-if="project.isMain" class="btn flex items-center justify-center  bg-black-light rounded-md aspect-square w-full h-full">
        <p class="text-[20px] md:text-twenty-seven-px font-black text-background-site">{{ project.name }}</p>

    </div>
    <div v-else class="md:relative md:gap-4 w-full h-full md:flex md:items-center md:justify-center overflow-hidden"
        @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <!-- first square -->
        <div
            class="project-frame project-relative-layout overflow-hidden"
            :class="{
                'md:invisible md:pointer-events-none': isHovered && hoveEffect && !isMobile,
                'md:visible': !isHovered && hoveEffect && !isMobile,
            }"
        >
            <img class="object-cover w-full h-full" :src="project.image_url" alt="">
        </div>
        <!-- second frame -->
        <div v-if="hoveEffect && !isMobile" class="project-frame bg-brown-site project-absolute-layout flex flex-row-reverse items-center justify-center text-right"
            :class="{
                'md:invisible md:pointer-events-none': !isHovered,
                'md:visible': isHovered,
            }">
            <div class="px-10 flex flex-row-reverse flex-wrap justify-center items-center content-center">
                <p class="text-center mx-auto">
                    <span class="text-section font-black  text-background-site">{{ project.translations?.he?.title }} </span>
                    <span class="section-content  text-background-site before:content-['|'] before:px-2"> {{ project.translations?.he?.sub_title }}</span>
                </p>
            </div>
        </div>
    </div>



</template>

<script>
import { ref, watchEffect } from 'vue';
import { useDeviceStore } from '@/stores/deviceStore';
import useImageMetadata from '@/composables/fetchImageMetadata.js'

export default { 
    props: {
        project: {
            type: Object,
            required: true
        },
        hoveEffect: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    setup(props){
        const language = ref("he")
        const deviceStore = useDeviceStore();
 
        const { imagesMetadata, error: errorUseImageMetadata, getMainImageUrl } = useImageMetadata();

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

        return {
            isHovered, 
            onMouseEnter, 
            onMouseLeave, 
            language,
            isMobile: deviceStore.isMobile,
            isTablet: deviceStore.isTablet,
            isDesktop: deviceStore.isDesktop,
            deviceType: deviceStore.deviceType,
            screenWidth: deviceStore.screenWidth,
            screenHeight: deviceStore.screenHeight
        }
    }

}
</script>

<style>

</style>