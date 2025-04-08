<template>
    <div class="relative margin-half-section rounded-3xl"
        :class = "[bgClass]"
    >
        <div class="grid grid-cols-10 gap-2 items-center margin-half-section py-20">
            <!-- Left part (Cat Image) -->
            <div class="col-span-4">
                <ContactMe />
            </div>
            <div class="col-span-5 justify-self-end">
                <img :src="titleImgSrc" class="object-cover w-auto h-full" alt="Title Image">
            </div>
            <div class="col-span-1">
                <img :src="sideImgSrc" class="pb-[30%] object-cover w-full h-auto" alt="Cat Image">
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
        const name = ref('')
        const message = ref('')
        const email = ref('')

        const sideImgSrc = ref(null)
        const titleImgSrc = ref(null)

        const { imagesMetadata, error, getImageUrlByRole } = useImageMetadata();
        const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()

        const bgClass = ref(null)
        bgClass.value = props.bgColor === 'green' ? 'bg-green-site' : props.bgColor === 'brown' ?  'bg-brown-site' : 'bg-green-site'

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