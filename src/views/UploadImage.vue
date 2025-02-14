<template>
    <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols justify-center items-center gap-4">
                <label  for="category">Category: </label>
                <select v-model="selectedCategory" @change="updateSubcategories">

                  <option value="">Select Category</option>
                  <option v-for="category in categorys" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
                <select v-if="subcategories.length" v-model="selectedSubcategory">
                  <option value="">Select Subcategory</option>
                  <option v-for="sub in subcategories" :key="sub" :value="sub">
                    {{ sub }}
                  </option>
                </select>
                <label for="">
                    <input type="file" ref="fileInput" @change="handleChange">
                </label>
                <button v-if=!isPending class="btn" >Uplaod Image</button>
                <div v-else> Uplaoding</div>
        </div>
    </form>
    <div v-if="fileSelectedError">
        <p>{{ fileSelectedError.value }}</p>
    </div>
    <div v-if="categoryError">
        <p>{{ categoryError.value }}</p>
    </div>

</template>

<script>
import { ref, watchEffect } from 'vue';

import useStorage from '@/composables/useStorage';
import useCollection from '@/composables/useCollection';

export default {
    setup(){
        const file = ref(null)

        // Create a template ref for the file input element
        const fileInput = ref(null);



        const isPending = ref(false)

        const fileSelectedError = ref(null)

        const selectedCategory = ref("")

        const categoryError = ref("")

        const types = ['image/png', 'image/jpeg']

        const categorys = ['navbar', 'blog', 'contact_me', 'projects']

        const subcategories = ref([])

        const selectedSubcategory = ref("")

        const imageMetaData = ref(null)

        const options = {
            blog: ["nomad", "enviroment", "thoughts"],
            projects: ["venatata", "world_city", "students_union", "mottomation", "bezalel"],
            gallery: ["landscapes", "portraits"],
            navbar: ['home_button']
        };

        const {url, error: fileError, filePath, uploadImage } = useStorage()

        const { error: errorImageMetadata, addDocImp }= useCollection('images_metadata')

        const updateSubcategories = () => {
            
            console.log(selectedCategory.value)

            subcategories.value = options[selectedCategory.value] || [];

            selectedSubcategory.value = "";
        }

        const handleSubmit = async() => {

            if (file.value){

                if (selectedCategory.value.trim() === ''){
                    categoryError.value = 'pls choose category'
                    file.value = null
                    return;
                }
                isPending.value = true


                imageMetaData.value = {
                    section: selectedCategory.value.trim(),
                    sub_section: selectedSubcategory.value.trim(),
                    role: "main",
                    identifier_id: '', 
                    updated_by: "admin", // Example field
                    tags: []
                }
                
                await uploadImage(file.value, selectedCategory.value, selectedSubcategory.value)

                isPending.value = false
            } else {
                fileError.value = null
                file.value = null

                isPending.value = false
            }
        }

        const handleChange = (e) => {
            const selected = e.target.files[0]
            if (selected && types.includes(selected.type)){
                console.log(selected.type)
                file.value = selected
            }
            else{
                file.value = null
                fileInput.value.value = ''
                fileSelectedError.value = 'Pls Select the correct file (png or jpag)'
            }
        }

        watchEffect(async() => {
            if (url && url.value){ 
                imageMetaData.value.image_url = (url.value)

                await addDocImp(imageMetaData.value)

                isPending.value = false
                
                cleanForm()
            }
        })
        
        const cleanForm = () => {
            file.value = null
            selectedCategory.value = ""
            selectedSubcategory.value = ""
            subcategories.value = []
            fileInput.value.value = ''
        }

        return { handleSubmit, handleChange, file, fileInput, fileSelectedError, categoryError, selectedCategory, categorys, subcategories, selectedSubcategory , updateSubcategories, isPending}
    }
}
</script>

<style>

</style>