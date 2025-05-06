<template>
  <div>
    <div class="h-screen">
      <AboutMe/>
    </div>
    <div id="introduction" class="mt-[4.5%]">
      <IntroductionParagraph/>
    </div>
    
    <!-- Projects --> 
    <div id="projects_section" class="mt-[4.5%]">
      <Clients/>
    </div>

    <!-- blog posts contact me sections -->
    <div id="blog_section" class="min-h-screen w-full mt-[4.5%]">
      <Blog/>
    </div>
    <div id="contactme_section" class="my-[4.5%]">
      <ContactMeWrapper/>
    </div>
  </div>
  <!-- preview section -->
</template>

<script>

import {onMounted, watch, nextTick} from 'vue';
import { useRoute } from 'vue-router';

import Clients from '@/components/Clients.vue';
import Blog from '@/components/Blog.vue';
import ContactMeWrapper from '@/components/ContactMeWrapper.vue'
import AboutMe from '@/components/AboutMe.vue';
import IntroductionParagraph from '@/components/IntroductionParagraph.vue';

export default {
  name: 'Home',
  components: {
    Clients,
    Blog,
    ContactMeWrapper,
    AboutMe,
    IntroductionParagraph,
  },
  setup(){
      const route = useRoute()

      const scrollToHash = () => {
      nextTick(() => {
        const hash = window.location.hash;
        if (hash) {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    };

    onMounted(() => {
      scrollToHash();
    });

    watch(route, () => {
      scrollToHash();
    });
  }


}
</script>
