<template>
  <form @submit.prevent="triggerUpload">
    <UploadImagess ref="uploadImageRef" @file-submitted="handleFileSubmission" 
          collection_name="general"   :dropdownOptions="['main', 'sub']"
    />
    <button>Submit from Parent</button>
  </form>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import UploadImagess from '@/components/UploadImages.vue'
  
  const uploadImageRef = ref(null);
  
  const triggerUpload = () => {
    if (uploadImageRef.value) {
      uploadImageRef.value.triggerSubmit(); // Calls the child's method
    }
  };

  const handleFileSubmission = ({ role, files }) => {
    console.log(`Role: ${role}`);
    files.map(item => console.log(item))
    };
  </script>
  