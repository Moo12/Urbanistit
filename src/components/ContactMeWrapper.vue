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
            <img src="/img/gur_contact_me_popup.png" alt="Overlay Image"
                    class="object-cover h-full md:h-[120%] w-auto ">

        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import ContactMe from '@/components/ContactMe.vue'
import useImageMetadata from '@/composables/getImageMetadata'

export default {
    components: {
        ContactMe,
    },
    setup(){
        const name = ref('')
        const message = ref('')
        const email = ref('')

        return { name, message, email}
    }

}
</script>


<style>
.bg-shape {
    width: 100%;   
    height: 100%;  
    border-top-left-radius: 50% 100%; 
    border-bottom-left-radius: 0;
    border-top-right-radius: 50% 100%; 
    border-bottom-right-radius: 0; 

}

</style>