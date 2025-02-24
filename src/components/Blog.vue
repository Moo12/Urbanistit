<template>
    <div class="w-full text-right">
        <router-link to="/blog">
            <div class="btn mt-12">
                <h2 class="text-4xl md:text-6xl font-bold text-white">
                 יוצאים מהמגירה
                </h2>
            </div>
        </router-link>

        <div class="w-3/4 mx-auto h-full mt-6">
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