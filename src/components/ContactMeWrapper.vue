<template>
    <div class="relative margin-half-section rounded-[60px]"
        :class = "[bgClass]"
    >
        <div class="grid grid-cols-6 md:grid-cols-10  gap-2 items-center margin-half-section py-20" dir="rtl">
            <!-- Left part (Cat Image) -->
            <div class="col-span-1">
                <img :src="sideImgSrc" class="pb-[30%] object-cover w-full h-auto" alt="Cat Image">
            </div>
            <div class="col-span-5 flex flex-wrap justify-start items-center">
                <p class="text-twenty-seven-px md:text-[54px] text-black-light font-black text-right m-0 leading-none">שניצור יחד<br> משהו מיוחד?</p>
            </div>
            <div class="col-span-6 md:col-span-4">
                <ContactMe />
            </div>
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
    
    props: {
        bgColor: {
            type: String,
            required: false,
            default: 'green'
        }
    },
    setup(props){
        const colorClassMap = {
            green: 'bg-green-site',
            brown: 'bg-brown-site',
            yellow: 'bg-yellow-site',
            blue: 'bg-blue-site',
            gray: 'bg-gray-background'
            // Add more if needed
        }
        const name = ref('')
        const message = ref('')
        const email = ref('')

        const sideImgSrc = ref(null)
        const titleImgSrc = ref(null)

        const { imagesMetadata, error, getImageUrlByRole } = useImageMetadata();
        const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()

        const bgClass = ref(null)

        bgClass.value = colorClassMap[props.bgColor] || 'bg-green-site'  // default to green

        watchEffect(() => {
            if (imagesMetadata?.value?.length && generalContentMetadata?.value?.get("contact_me")){
                let generalContentItem = generalContentMetadata.value.get("contact_me")
                sideImgSrc.value = getImageUrlByRole(generalContentItem.common_data?.images_metadata, "side")
                titleImgSrc.value = getImageUrlByRole(generalContentItem.common_data?.images_metadata, "title")
            }
        })
        
        return { name, message, email, sideImgSrc, titleImgSrc, bgClass}
    }
}
</script>


<style>
</style>