<template>
  <div>
    <nav class="shadow-md border-b border-gray-400">
        <div class="relative mx-2 md:mx-8 flex justify-between items-center">
            <!-- home button -->
            <a href="/" class="md:w-1/4 w-1/2 h-1/8-screen  overflow-hidden">
                <img :src="homeImageSrc" class="w-full h-full object-cover" alt="">
            </a>
            <!-- drop down menu button -->
            <button @click="isOpen = !isOpen" class="flex items-center justify-center px-4 w-20 h-30 cursor-pointer md:hidden  bg-menu-button rounded-full" id="burger">
                <svg class="w-5 py-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>

            <!-- horizontal anchors-->
            <ul id="menu" class="hidden md:flex flex-row space-x-8 items-center">
                <li v-for="(item, index) in menuItems" :key="index" class="btn">
                    <a :href="item.href" class="font-bold text-3xl no-underline inline-flex">{{ item.text }}</a>
                </li>
            </ul>

            <!-- dropdown manu-->
            <DropdownMenu v-if="isOpen" :menuItems="menuItems" :isOpen="isOpen" class="md:hidden" @close="isOpen = !isOpen"/>
        </div>
    </nav>
  </div>
</template>

<script>
import { onMounted, ref, watchEffect } from 'vue';

import DropdownMenu from './DropdownMenu.vue';
import useImageMetadata from '@/composables/getImageMetadata'
 
export default {
  props: {
    menuItems: {
          type: Array,
          required: true
      },
  },
  components: {
    DropdownMenu,
  },
  setup(){
    const isOpen = ref(false)

    const homeImageSrc = ref(null)

    const { metadata, error, loading, fetchMetadata } = useImageMetadata();

    onMounted(() => {
      fetchMetadata("navbar")
    })

    watchEffect( () => {

      if (metadata.value && metadata.value.length){
        console.log('navbar metadata has been retrieved', metadata.value) 


        const matchingMeta = metadata.value.filter(meta => 
          meta.sub_section === "home_button")
      
        if (matchingMeta.length ) {
          homeImageSrc.value = matchingMeta[0].image_url
        }
      }
    });



    return { isOpen, homeImageSrc }
  }
}


</script>

<style>

</style>