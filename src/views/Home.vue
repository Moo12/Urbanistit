<template>
  <div class="mt-10">
    <div id="introduction">
      <AboutMe/>
    </div>
    <!-- Projects --> 
    <div id="projects_section">
      <Projects/>
    </div>

    <!-- blog posts contact me sections -->
    <div class="bg-gray-200">
      <div id="blog_section" class="w-full mt-6">
        <Blog/>
      </div>
      <div class="">

      </div>
      <div id="contactme_section">
        <ContactMeWrapper/>
      </div>
    </div>
  </div>
  <!-- preview section -->
</template>

<script>

import Projects from '@/components/Projects.vue';
import Blog from '@/components/Blog.vue';
import ContactMeWrapper from '@/components/ContactMeWrapper.vue'
import AboutMe from '@/components/AboutMe.vue';

export default {
  name: 'Home',
  components: {
    Projects,
    Blog,
    ContactMeWrapper,
    AboutMe,
  }

}
</script>
