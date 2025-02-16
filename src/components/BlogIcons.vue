<template>
    <div class="flex content-center justify-center">

        <div class="grid  grid-cols-[repeat(3,_1fr)] gap-3 md:gap-8 justify-around">
    
                <div v-for="(topic, index) in icons" :key="index" class="btn aspect-square m-1 md:m-16 flex flex-col justify-center items-center  p-3 rounded-3xl bg-contact-me-bg">
                    <!--  grid row -->
                    <!-- <div  class="btn flex flex-col items-center p-3">
                        <div class="w-full h-12  md:h-20 lg:h-40  flex justify-center items-center">
                            <img :src="topic.source" class="h-full w-full object-contain" alt="">
                        </div>
                        <h2  class=" mt-4 text-background-site text-2xl md:text-4xl font-bold"> {{ topic.title  }}</h2>
                    </div> -->
                        <!--  images row -->
                        <!-- Image Row (Fixed Height + Aspect Ratio) -->
                        <div class="md:w-2/3 md:h-2/3 w-1/2 h-1/2 flex justify-center items-center">
                            <img :src="topic.image_url" class="h-full w-full object-contain" alt="">
                        </div>
                        <!-- <img :src="topic.source"  class="object-contain" alt=""> -->
                        <h2  class="md:mt-4 text-background-site text-3xl md:text-4xl font-bold"> {{ topic.title  }}</h2>
            
                </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        icons: {
            type: Array,
            required: true
        },
        vertical: {
            type: Boolean,
            required: true
        }
    },
}
</script>

<style>

</style>