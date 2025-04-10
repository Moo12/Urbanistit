<template>
    <div class="padding-section flex flex-col gap-16">
        <!-- title and clients images -->
         
        <div class="grid grid-cols-4 gap-10" :dir="directionClass">
            <p class="col-span-2 header-fifty-four-px">פרויקטים שיצאו לאור</p>
            <div class="col-start-1 col-span-2">
                <p class="section-content">כאן, בין הרעיונות, אני טווה חוטים דקים של מחשבה והופכת אותם למציאות. משלב האסטרטגיה הראשוני ועד הנגיעה האחרונה בעיצוב - כל פרויקט הוא מסע, מפגש בין חלום למציאות, בין מילים לתמונה.</p>
            </div>
            <div v-for="client in clientssDocuments" :key="client.id" class="col-span-1"
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
    <div class="mt-[7.3%]">
        <Scroller :items="projectsImages" :itemWidth="16" :itemGap="2"/>
    </div>

    <div id="contactme_section" class="mt-[7.3%] mb-[3.7%]">
      <ContactMeWrapper bgColor="brown"/>
    </div>

  
</template>

<script setup>
import { ref, watchEffect, computed} from 'vue';
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

const selectedLang = ref(props.language || "he")
const directionClass = ref('')
directionClass.value = selectedLang.value === 'he' ? "rtl" : "lft"

const projectsImages = ref([])

const { imagesMetadata, error : errorImageMd, getMainImageUrl, getImageUrl } = useImageMetadata();
const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()
const { documents : clientssDocuments , error : errorClientsDocs, fetchCollectionOnce : fetchCollectionOnceClients } = getCollection("clients")
const { documents : projectsDocuments , error : errorProjectsDocs, fetchCollectionOnce : fetchCollectionOnceProjects } = getCollection("projects")

const { initializeToggled, handleClick, currentToggledKey } = useSelectorToggle([], "")

const emitClientClick = defineEmits();

fetchCollectionOnceClients()

fetchCollectionOnceProjects()

watchEffect(() => {
    if (clientssDocuments?.value?.length){
        initializeToggled(clientssDocuments.value.map(category => category.id));
    }

    projectsDocuments?.value?.forEach(doc => {
        projectsImages.value.push( { image: getMainImageUrl(doc.default.images_metadata) })
    });
})

const currentClient = computed(() =>
    clientssDocuments?.value?.find(client => client.id === currentToggledKey.value) || null
);

</script>

<style>

</style>