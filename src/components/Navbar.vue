<template>
  <div >
    <nav class="shadow-md border-b border-gray-400 z-[10000]" ref="navbarRef">
        <div class="relative mx-2 md:mx-8 flex justify-between items-center">
            <!-- home button -->
            <div v-if="homeAnchor" class="md:w-1/8 w-1/2 h-1/8-screen  overflow-hidden">
              <router-link :to="homeAnchor.href">
                <img :src="homeAnchor.image" class="w-full h-full object-cover" :alt="homeAnchor.label">
              </router-link>
            </div> 

            <!-- drop down menu button -->
            <button @click="isOpen = !isOpen" class="flex items-center justify-center px-4 w-20 h-30 cursor-pointer md:hidden  bg-menu-button rounded-full" id="burger">
                <svg class="w-5 py-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>

            <!-- horizontal anchors-->
            <ul id="menu" class="hidden md:flex flex-row space-x-8 items-center">
                <li v-for="(item, index) in sideMenuItems" :key="index" class="btn">
									<router-link :to="item.href" class="section-title-main no-underline inline-flex">
											{{ item.label }}
									</router-link>
                </li>
            </ul>

            <!-- dropdown manu-->
            <DropdownMenu v-if="isOpen" :menuItems="localMenuItems" :isOpen="isOpen" class="md:hidden" @close="isOpen = !isOpen"/>
        </div>
    </nav>
  </div>
</template>

<script>
import { ref, watchEffect, computed, nextTick, onMounted, onUnmounted } from 'vue';

import DropdownMenu from './DropdownMenu.vue';

import useImageMetadata from '@/composables/fetchImageMetadata'
import useGeneralContentMetadata from '@/composables/fetchGeneralContent';

 
export default {
  components: {
    DropdownMenu,
  },
  emits: ['navbarHeightUpdate'],
  setup(_, { emit }){
    const navbarRef = ref(null);
    let resizeObserver = null;

    const isOpen = ref(false)

    const localMenuItems = ref([]);

    const homeAnchor = ref(null);
    const { imagesMetadata, error } = useImageMetadata();
    const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()

    watchEffect(() => {
        if (imagesMetadata?.value?.length && generalContentMetadata?.value?.get("navbar")){
          let generalContentItem = generalContentMetadata.value.get("navbar")

                    localMenuItems.value = generalContentItem.translations?.he?.nav_links?.value

                    

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

    const updateHeight = () => {
      if (navbarRef.value) {
        const newHeight = navbarRef.value.getBoundingClientRect().height;
        emit('navbarHeightUpdate', newHeight); // Emit to App.vue
      }
    };

    onMounted(() => {
      nextTick(() => {
        if (navbarRef.value) {
          // Setup ResizeObserver
          resizeObserver = new ResizeObserver(() => updateHeight());
          resizeObserver.observe(navbarRef.value);

          // Ensure images trigger an update when they load
          const images = navbarRef.value.querySelectorAll("img");
          images.forEach(img => {
            if (!img.complete) {
              img.onload = updateHeight;
              img.onerror = updateHeight;
            }
          });

          // MutationObserver: Watch for DOM changes like added images
          const mutationObserver = new MutationObserver(() => updateHeight());
          mutationObserver.observe(navbarRef.value, { childList: true, subtree: true });
        }
      });
    });

    onUnmounted(() => {
      if (resizeObserver) resizeObserver.disconnect();
    });

    return { isOpen, homeAnchor, sideMenuItems, localMenuItems, navbarRef }
  }
}


</script>

<style>

</style>