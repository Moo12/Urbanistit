<template>
          
    <div class="flex flex-col items-center w-full overflow-hidden justify-center">

        <div v-if="projectDocs" ref="scrollContainer" 
            :class="{
                'flex w-full gap-[4%] overflow-x-auto hide-scrollbar' : !deviceStore.isMobile,
                'grid grid-cols-2 w-full gap-4' : deviceStore.isMobile
            }"
            @scroll="updateScrollPosition">
            <div v-for="project in projectDocs" @click="handleProjectClick(project.id)" :key="project.id" 
                class="btn  px-[3%] rounded-xl   flex items-center justify-center "
                :class="{
                    'bg-black-light' : toggled[project.id],
                    'bg-yellow-site' : !toggled[project.id],
                    'w-full aspect-[3/2]' : deviceStore.isMobile,
                    'aspect-[5/3] max-w-[30%] min-w-[30%]' : !deviceStore.isMobile
                    }">
                <p class="text-section text-background-site text-center"> {{ project.translations[language].title }} </p>
            </div>
        </div>
        <!-- Custom Scroll Dots -->
        <div v-if="pageCount > 2 && !deviceStore.isMobile"  class="flex justify-center mt-3 gap-1">
        <span
            v-for="(_, index) in pageCount"
            :key="index"
            class="w-2 h-2 rounded-full"
            :class="{
            'bg-gray-400': index !== currentPage,
            'bg-gray-700': index === currentPage
            }"
        ></span>
        </div>
    </div>
</template>
            
<script>
import useSelectorToggle from '@/composables/useSelectorToggle';
import { watchEffect, ref, computed} from 'vue';
import { useDeviceStore } from '@/stores/deviceStore'

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
        
        const deviceStore = useDeviceStore()
        
        const scrollContainer = ref(null);

        const currentPage = ref(0)

        const parsePercentage = (percentStr) => parseFloat(percentStr) / 100;


        const itemWidth = computed(() => {
            if (!scrollContainer.value) return 0;

            scrollContainer.value.getBoundingClientRect().width

            const containerWidth = scrollContainer.value.getBoundingClientRect().width;
            const itemW = containerWidth * parsePercentage(30);
            const gap = containerWidth * parsePercentage(3);

            return itemW + gap;
        })

        const updateScrollPosition = () => {
            const scrollLeft = scrollContainer.value.scrollLeft;
            currentPage.value = Math.round(scrollLeft / itemWidth.value) * -1 + pageCount.value - 2;
        };

        const pageCount = computed(() =>
            Math.ceil(props.projectDocs.length || 0)
        );


        const handleProjectClick = (id) => {
          handleClick(id, emit);
        };

        watchEffect(() => {
            if (props.projectDocs){
                initializeToggled(props.projectDocs.map(item => item.id))

                currentPage.value = props.projectDocs.length > 2 ? 2 : props.projectDocs.length - 1
            }
        })

        // Scroll tracking

        return { handleProjectClick, toggled, pageCount, updateScrollPosition, scrollContainer, currentPage, deviceStore }
    }
}
</script>

<style scoped>

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>