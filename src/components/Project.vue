<template>
    <div v-if="project.isMain" class="btn flex items-center justify-center  bg-contact-me-bg rounded-3xl aspect-square w-full h-full">
        <h1 class="font-bold text-5xl text-background-site">{{ project.name }}</h1>

    </div>
    <!-- <div v-else @mouseenter="onMouseEnter" @mouseleave="onMouseLeave"
        class="relative transitixon-opacity duration-300 w-full overflow-hidden text-right aspect-square rounded-3xl border-8 border-projects-cards cursor-pointer ">
        
        <div :class="isHovered ? 'invisible pointer-events-none' : 'btn visible absolute top-0 right-0 w-full h-full '">
            <img class="object-fill" :src="project.source" alt="">
        </div>

        <div :class="isHovered ? 'visible absolute top-0 right-0 pointer-events-none' : 'invisible' "  
            class=" bg-projects-cards  w-full h-full gap-2 transition-opacity duration-300 flex flex-row-reverse items-center justify-center text-right">
            <h1 class="font-bold text-xl md:text-4xl border-l-4 text-background-site border-background-site px-2">{{ project.title }}</h1>
            <h1 id="" class="text:xl md:text-4xl text-background-site"> {{ project.subtitle }}</h1>
        </div>
    </div> -->

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
            <img class="object-cover w-full h-full" :src="project.source" alt="">
        </div>
        <!-- second frame -->
        <div class="project-frame bg-projects-cards md:project-absolute-layout flex flex-row-reverse items-center justify-center text-right"
            :class="{
                'md:invisible md:pointer-events-none': !isHovered,
                'md:visible': isHovered,
                'project-relative-layout' : screenWidth < 768,
                'project-absolute-layout' : screenWidth >= 768,
 
            }">
            <h1 class="font-bold text-xl md:text-4xl border-l-4 text-background-site border-background-site px-2">{{ project.title }}</h1>
            <h1 class="text:xl md:text-4xl text-background-site"> {{ project.subtitle }}</h1>
        </div>
    </div>



</template>

<script>
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import useImageMetadata from '@/composables/getImageMetadata'

export default { 
    props: {
        project: {
            type: Object,
            required: true
        }
    },
    setup(props){

        const screenWidth = ref(window.innerWidth);

        const { metadata, error, loading, fetchMetadata } = useImageMetadata();

        const updateScreenWidth = () => {
            screenWidth.value = window.innerWidth;
        };

        onMounted(async () => {
            window.addEventListener("resize", updateScreenWidth);

            const roleCondition = [
                {
                    field: 'sub_section',
                    operator: '==',
                    value: props.project.identifier,
                },
                {
                    field: 'role',
                    operator: '==',
                    value: 'main',
                }
            ]

            await fetchMetadata('projects', roleCondition)

            if (!error.value){
                console.log("error loading images metadata", error.value)
            }
        });

        onUnmounted(() => {
            window.removeEventListener("resize", updateScreenWidth);
        });


        watchEffect(()=>{
            console.log('metadata length', metadata.value.length)
            if (metadata.value.length){
                props.project.source = metadata.value.at(0).image_url
            }
        })

        const isHovered = ref(false)

        const onMouseEnter = () => {
            isHovered.value = true;

        }

        const onMouseLeave = () => {
            isHovered.value = false;
        }

        return {isHovered, onMouseEnter, onMouseLeave, screenWidth}
    }

}
</script>

<style>

</style>