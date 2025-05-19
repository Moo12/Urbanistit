<template>
  <div class="my-10 mx-10 md:mx-40 flex flex-col">
    <!-- ALL CONTENT -->
     <div class="flex flex-col gap-16"
     :class="{
      'h-full' : selectedProject,
      'h-[80vh]': !selectedProject
     }">

       <div v-if="clientDoc && !errrorLoadClientDoc">
         <!-- IMAGE AND TITLES -->
         <div  class="grid grid-cols-12 justify-start" :dir="directionClass">
           <!-- IMAGE-->
           <div class="square-frame project-frame md:col-span-5 lg:col-span-4 col-span-10 overflow-hidden">
             <img :src=clientMainImage class="h-full object-cover" alt="">
           </div>
           <!-- title and sub title -->
           <div class="flex flex-col col-span-6 lg:col-start-6 lg:col-span-7 justify-between text-right gap-6">
             <div class="flex flex-col gap-8">
               <p class="w-[70%] text-twenty-seven-px md:text-[54px] text-black-light leading-none font-black  text-right ">{{ clientDoc.translations.he.title }}</p>
               <p class="section-content text-right">{{ clientDoc.translations.he.sub_title }}</p>
             </div>
             <ProjectSelector v-if="clientProjects" :projectDocs="clientProjects" :language="language"  @ProjectSelectorClicked="handleProjectSelect" />
           </div>
           <div>
           </div>
         </div>
       </div>
       <!-- projets -->
       <div v-if="selectedProject">
         <Project :projectDoc="selectedProject" :language="language"/>
       </div>
       <router-link :to="{ name: 'ClientsPage' }">
         <span class="text-section">חזרה לפרויקטים >></span>
       </router-link>
    </div>
  </div>
  <ContactMeWrapper bgColor="brown"></ContactMeWrapper>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router';

import getDocument from '@/composables/getDocument';
import useImageMetadata from '@/composables/fetchImageMetadata'
import getCollection from '@/composables/getCollection';
import ProjectSelector from '@/components/ProjectSelector.vue';
import Project from '@/components/Project.vue';
import ContactMeWrapper from '@/components/ContactMeWrapper.vue';

const language = ref("he")

const directionClass = ref('')
directionClass.value = language.value === 'he' ? "rtl" : "lft"


const route = useRoute();
const id = ref(route.params.id)

const selectedProject = ref(route.params.project_id)

const { error: errrorLoadClientDoc, document : clientDoc } = getDocument("clients", id.value)
const { imagesMetadata, error: errorUseImageMetadata, getMainImageUrl } = useImageMetadata();

const { documents : all_projects , error : errorGetProjects, fetchCollectionOnce : fetchPrjectsCollectionOnce} = getCollection('projects')

fetchPrjectsCollectionOnce()

const clientProjects = computed(() => {
  console.log('all projects', all_projects.value)
  return all_projects.value?.filter(project => project?.default?.clients === id.value)
})

const clientMainImage = computed(() => {

  if (imagesMetadata?.value?.length && clientDoc.value ){
      return getMainImageUrl(clientDoc.value.default.images_metadata)
  }

  return ""
})

const handleProjectSelect = ((id) => {
  console.log("handleProjectSelect", id)

  if (id === 0){
    console.log("no project was seleced")
    selectedProject.value = null
    return
  }

  
  const _selectedProject = clientProjects.value?.filter(item => item.id === id)
  console.log("line 77")

  if (_selectedProject.length){
    selectedProject.value = _selectedProject[0]
    console.log("selectedProject", selectedProject.value)
  }
  else{
    console.error("project was not found")
  }
})

</script>

<style>

</style>