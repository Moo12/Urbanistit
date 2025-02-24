<template>
  <div class="flex flex-row">
    <!-- first part -->
    <div class="flex flex-row justify-between items-end">
        <!-- inage -->
         <div class="flex-[3] h-full w-full rounded-3xl  overflow-hidden">
            <img src='img/Blipi.png' class="h-full aspect-[8/16] object-cover" alt="">
         </div>
         <!-- header and icons -->
        <div class="flex-[2] h-full w-full flex flex-col mt-12 content-center justify-between">
            <div class="flex flex-col gap-3 justify-center text-center items-center">
                <p class="header-title">יוצאים מהמגירה</p>
                <p class="header-title-sub">הפשיטו אותי</p>
            </div>
            <BlogIcons class="" iconBg="beige" :vertical="true"/>
        </div> 

    </div>  
    <!-- second part tags -->
    <div>

    </div>
  </div>
</template>

<script>
import BlogIcons from '@/components/BlogIcons.vue';

export default {
    components: {
        BlogIcons
    }

}
</script>

<style>

</style>