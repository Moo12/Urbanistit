<template>
    <div class="padding-section flex flex-col gap-16">
        <!-- title and clients images -->
         
        <div class="grid grid-cols-2    md:grid-cols-4 gap-10 mt-[30px]">
            <div class="col-span-2 flex flex-col justify-center items-center md:grid md:grid-cols-6 gap-4 text-center">
                    <p class="md:col-span-4 text-[54px] font-black leading-none">פרויקטים שיצאו לאור</p>
                    <p class="md:col-span-5 section-content">כאן, בין הרעיונות, אני טווה חוטים דקים של מחשבה והופכת אותם למציאות. משלב האסטרטגיה הראשוני ועד הנגיעה האחרונה בעיצוב - כל פרויקט הוא מסע, מפגש בין חלום למציאות, בין מילים לתמונה.</p>
            </div>
            <div v-for="client in orderedClients" :key="client.id" class="col-span-1 place-self-end"
                :class="[
                { 
                    'opacity-70': currentToggledKey === client.id,
                }]"
                >
                <router-link :to="{ name: 'Client', params: { id: client.id }}">
                    <Client :project="client"></Client>
                </router-link>  
            </div>
        </div>
    </div> 
    <div class="mt-[7.3%] py-[3%] bg-gray-background" v-if="projectsImages?.length > 0">
        <Scroller :items="projectsImages" :itemWidth="deviceStore.isMobile ? 26 : 16" :itemGap="deviceStore.isMobile ? 4 : 2"
        @click="onImageClick">
            <template v-slot:default="{ item }">
                <div class="w-full h-full group flex flex-wrap justify-center items-center">
                    <div
                        class="absolute inset-0 bg-black opacity-0 group-hover:opacity-75 transition-opacity duration-300"
                    ></div>
                    <div class="relative z-10 text-white text-[18px] invisible group-hover:visible 
                px-2 text-center whitespace-normal break-words max-w-full">
                    {{ item.title }}</div>
                </div>
            </template>
        </Scroller>
    </div>

    <div id="contactme_section" class="mt-[7.3%] mb-[3.7%]">
      <ContactMeWrapper bgColor="brown"/>
    </div>

  
</template>

<script setup>
import { ref, watchEffect, computed} from 'vue';
import { useRouter } from 'vue-router';

import { useDeviceStore } from '@/stores/deviceStore'
import useImageMetadata from '@/composables/fetchImageMetadata'
import useGeneralContentMetadata from '@/composables/fetchGeneralContent';
import getCollection from '@/composables/getCollection';
import useSelectorToggle from '@/composables/useSelectorToggle';
import Client from '@/components/Client.vue';
import Scroller from '@/components/Scroller.vue';
import ContactMeWrapper from '@/components/ContactMeWrapper.vue';

const props = defineProps({
    language: String
})

const router = useRouter()

const deviceStore = useDeviceStore()

const selectedLang = ref(props.language || "he")

const projectsImages = ref([])

const { imagesMetadata, error : errorImageMd, getMainImageUrl, getImageUrl } = useImageMetadata();
const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()
const { documents : clientsDocuments , error : errorClientsDocs, fetchCollectionOnce : fetchCollectionOnceClients } = getCollection("clients")
const { documents : projectsDocuments , error : errorProjectsDocs, fetchCollectionOnce : fetchCollectionOnceProjects } = getCollection("projects")

const { initializeToggled, handleClick, currentToggledKey } = useSelectorToggle([], "")

const emitClientClick = defineEmits();

fetchCollectionOnceClients()

fetchCollectionOnceProjects()

const orderedClients = computed(() => {
    if (clientsDocuments?.value){

        return clientsDocuments.value.sort((a, b) => {
            const aIndex = a.metadata?.index;
          const bIndex = b.metadata?.index;
        
          const aHasIndex = typeof aIndex === 'number';
          const bHasIndex = typeof bIndex === 'number';
        
          if (aHasIndex && bHasIndex) return aIndex - bIndex;
          if (aHasIndex) return -1;
          if (bHasIndex) return 1;
          return 0;
        })
    }
    else{
        return []
    }
})

watchEffect(() => {
    console.log("watchEffect projects  documents size" , clientsDocuments.value?.length)
    if (clientsDocuments?.value?.length){
        initializeToggled(clientsDocuments.value.map(item => item.id));
    }

    projectsDocuments?.value?.forEach((doc, index) => {
            let imageObj = { image: getMainImageUrl(doc.default.images_metadata), index : index,
            title: doc.translations[selectedLang.value]?.title, client_id: doc.default.clients, id : doc.id }
            if  (imageObj?.image){
                projectsImages.value.push(imageObj)
            }
            else{
                console.log("no image for project", doc.id)
            }
    })

    console.log("projectsImages", projectsImages.value)
})

const currentClient = computed(() =>
    clientsDocuments?.value?.find(client => client.id === currentToggledKey.value) || null
);

const onImageClick = (item) => {
    router.push( { name: 'Client', params: { id: item.client_id, project_id : item.id } })
}

</script>

<style>

</style>