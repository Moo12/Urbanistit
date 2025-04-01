<template>
    <div v-if="projectDocs" class="grid grid-cols-5 items-center">
        <div v-for="(project, index) in projectDocs" @click="handleProjectClick(project.id)" :key="project.id" 
            class="btn bg-yellow-site col-span-2 aspect-[5/3] px-3 rounded-3xl flex items-center"
            :class="{
            'bg-black-light': toggled[project.id],   // Default background for untoggled tags
            'col-start-4': (index + 1) % 2 === 0,
            }">
            <p class="text-section text-background-site text-center"> {{ project.translations[language].title }} </p>
        </div>
    </div>
</template>
            
<script>
import useSelectorToggle from '@/composables/useSelectorToggle';
import { watchEffect, ref } from 'vue';

export default {
    props: {
        projectDocs: {
            type: Array,
            required: true
        },
        language: {
            type: String,
            required: false,
            default: "he"
        },
    },
    
    emit: ["ProjectSelectorClicked"],
    
    setup(props, { emit }){
        const { toggled, initializeToggled, handleClick } = useSelectorToggle([] ,"ProjectSelectorClicked")

        const handleProjectClick = (id) => {
          handleClick(id, emit);
        };

        watchEffect(() => {
            if (props.projectDocs){
                console.log("projectDocs", props.projectDocs)
                initializeToggled(props.projectDocs)
            }
        })

        return {  handleProjectClick, toggled }
    }
}
</script>

<style>

</style>