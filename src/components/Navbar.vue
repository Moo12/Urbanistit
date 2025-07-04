<template>
  <div>
    <nav 
      class="z-[100] padding-section flex items-center" 
      dir="ltr"
      :class="navClass" 
      ref="navbarRef"
      :style="navbarStyle"
    >
        <div class="relative">
            <!-- home button -->
             <div class="flex justify-between items-center">

               <div v-if="homeAnchor" class="md:w-1/4 lg:w-1/8 w-1/2   overflow-hidden">
                 <router-link :to="homeAnchor.href">
                   <img :src="homeAnchor.image" class="w-full object-cover" :alt="homeAnchor.label">
                 </router-link>
               </div> 
   
               <!-- drop down menu button -->
               <button @click="isOpen = !isOpen" class="flex items-center justify-center px-4 w-20 h-30 cursor-pointer md:hidden  bg-yellow-site rounded-full" id="burger">
                   <svg class="w-5 py-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                   </svg>
               </button>
   
               <!-- horizontal anchors-->
               <ul id="menu" class="hidden md:flex flex-row space-x-8 items-center">
                   <li v-for="(item, index) in sideMenuItems" :key="index" class="btn">
                     <router-link :to="item.href" class="text-section font-black no-underline inline-flex">
                         {{ item.label }}
                     </router-link>
                   </li>
               </ul>
   
               <!-- dropdown manu-->
               <DropdownMenu v-if="isOpen" :menuItems="localMenuItems" :isOpen="isOpen" class="md:hidden" @close="isOpen = !isOpen"/>
             </div>
        </div>
    </nav>
  </div>
</template>

<script>
import { ref, watchEffect, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

import DropdownMenu from './DropdownMenu.vue';

import useImageMetadata from '@/composables/fetchImageMetadata'
import useGeneralContentMetadata from '@/composables/fetchGeneralContent';
import { ReceiptEuroIcon } from 'lucide-vue-next';




export default {
  components: {
    DropdownMenu,
  },
  setup(){
    const navbarRef = ref(null);
    let resizeObserver = null;

    const isOpen = ref(false)

    const localMenuItems = ref([]);

    const homeAnchor = ref(null);
    const { imagesMetadata, error } = useImageMetadata();
    const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()
    
    const isScrolled = ref(false);
    
    const route = useRoute();

    // Get navbar layout from route meta
    const navbarLayout = computed(() => {
      return route.meta?.navbarLayout || 'fixed'; // Default to fixed if not specified
    });

    watchEffect(() => {
        if (imagesMetadata?.value?.length && generalContentMetadata?.value?.get("navbar")){
          let generalContentItem = generalContentMetadata.value.get("navbar")

                    localMenuItems.value = generalContentItem.translations?.he?.nav_links?.value

                    localMenuItems.value = localMenuItems.value.reverse()

                    if (!localMenuItems.value?.length){
                      console.error('nav items is empty')
                      return;
                    }

                    localMenuItems.value.forEach(menuItem => {
                        if (menuItem.image_metadata !== '') {
                            let imgMetadata = imagesMetadata.value.filter(img => img.id === menuItem.image_metadata);

                            if (imgMetadata.length) {
                                menuItem.image = imgMetadata[0].image_url;
                            }
                            else{
                              console.error('did not match image for : ', menuItem.label)
                            }
                        }
                    });
                    // Assign the home anchor
                    homeAnchor.value = localMenuItems.value.find(menuItem => menuItem.id.toLowerCase() === "home") || null;
                    
                }
    });

    //remove home button
    const sideMenuItems = computed(() => {
      return localMenuItems?.value?.filter(item => item.id.toLowerCase() !== "home") || [];
    });

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50; // Change when scrolled past 50px
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);

    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    // Compute navbar styles based on layout mode
    const navbarStyle = computed(() => {
      if (isScrolled.value) {
        // Fixed layout
        return {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
        };
      }
    });

    const navClass = computed(() => {
      if (navbarLayout.value === 'stacked') {
        // Stacked layout always has white background
        return "bg-white text-black border-gray-400 shadow-md";
      } else {
        // Fixed layout with scroll-based background
        return isScrolled.value
          ? "bg-white text-black border-gray-400 shadow-md" // White background when scrolled
          : "bg-transparent text-black-light"; // Transparent when at the top
      }
    });

    return { 
      isOpen, 
      homeAnchor, 
      sideMenuItems, 
      localMenuItems, 
      navbarRef, 
      navClass, 
      navbarStyle,
      navbarLayout 
    }
  }
}


</script>

<style>

</style>