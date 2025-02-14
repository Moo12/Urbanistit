<template>
    <div class="w-full h-full bg-cover">
        
        <!-- contett -->
        <div class="w-5/6 mx-auto h-full overflow-hidden" >
            <!-- horizontal anchors-->
            <ul  class="flex  h-full flex-row justify-between items-center">
                <li v-for="(item, index) in menuItems" :key="index" class="btn h-full">
                    <a :href="item.href" class="no-underline h-full flex items-center">
                        <img v-if="item.image" :src="item.image" alt="item.text" class="h-3/4 self-end object-cover" />
                        <p v-else class="font-bold  md:text-3lg  lg:text-5xl text-background-site">{{ item.text }}</p>
                    </a>
                </li>
            </ul>
        </div>

    </div>
  
</template>

<script>
export default {
    props: {
      menuItems: {
          type: Array,
          required: true
      },
    },
    setup(){

    }


}
</script>

<style>

.bg-cover {
  background-image: url('../assets/img/gur_footer.png');
  background-size: cover;
  background-position: center 50%;
  width: 100%;
  aspect-ratio: 16 / 2 ; 
}




</style>