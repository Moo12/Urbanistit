<template>
    <div v-if="projectDocs" class="flex justify-center items-center gap-6">
        <div v-for="project in projectDocs" @click="handleProjectClick(project.id)" :key="project.id" 
            class="rounded-3xl flex  justify-center items-center p-3 cursor-pointer bg-menu-button text-background-site"
            :class="{
            'opacity-70 border-2': toggled[project.id],  // Add selected class based on toggled status
            'opacity-100': !toggled[project.id]   // Default background for untoggled tags
            }">

            <p class="header-title-sub text-background-site"> {{ project.translations[language].title }} </p>
        </div>
    </div>
</template>


<script>
import useSelectorToggle from '@/composables/useSelectorToggle';
import { watchEffect } from 'vue';

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