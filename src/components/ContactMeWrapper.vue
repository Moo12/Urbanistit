<template>
    <!-- <div class="w-full h-40 bg-contact-me-bg"
         style="clip-path: polygon(0 85%, 50% 0, 100% 85%, 100% 100%, 0 100%);">
    </div> -->

    <div class="bg-contact-me-bg p-8 relative">
        <!-- left part -->
         <div class="w-5/6 mx-auto">
            <ContactMe aligmentDirection="center"/>
         </div>

        <!-- right part -->
        <div class="absolute right-0 top-[-10%] md:top-[-20%] h-full">
            <img :src="sideImgSrc" alt="Overlay Image"
                    class="object-cover h-full md:h-[120%] w-auto ">

        </div>
    </div>
</template>

<script>
import { ref, watchEffect } from 'vue';
import ContactMe from '@/components/ContactMe.vue'
import useImageMetadata from '@/composables/fetchImageMetadata'
import useGeneralContentMetadata from '@/composables/fetchGeneralContent';


export default {
    components: {
        ContactMe,
    },
    setup(){
        const name = ref('')
        const message = ref('')
        const email = ref('')

        const sideImgSrc = ref(null)

        const { imagesMetadata, error } = useImageMetadata();
        const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()

        watchEffect(() => {
            if (imagesMetadata?.value?.length && generalContentMetadata?.value?.length){
                generalContentMetadata.value.forEach(generalContentItem => {
                    if (generalContentItem.id === "contact_me"){
                        let sideImg = imagesMetadata.value.filter( item => item.id === generalContentItem.common_data?.images_metadata?.side)
                        if (sideImg?.length){

                            sideImgSrc.value = sideImg[0].image_url
                            
                        }
                        else{
                            console.error('contact me side  image  url was not found in general content')
                        }
                    }
                })
            }
        })


        return { name, message, email, sideImgSrc}
    }

}
</script>


<style>
</style>