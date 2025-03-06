<template>
    <div class="w-full text-right padding-section">
        <router-link to="/blog">
            <div class="btn">
                <p class="header-title text-contact-me-bg">
                 יוצאים מהמגירה
                </p>
            </div>
        </router-link>

        <div class="mt-6 flex justify-center">
            <BlogIcons :vertical="false"/>
        </div>
        <!--  images title gird -->
    </div>

</template>
  
<script>

import BlogIcons from './BlogIcons.vue';


export default {
    components: {
        BlogIcons
    },
    setup(){
        
    }


}
</script>

<style>

</style>