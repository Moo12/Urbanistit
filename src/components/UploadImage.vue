<template>
      <div class="grid grid-cols justify-center items-center gap-4">
        <label>
          <input type="file" ref="fileInput" @change="handleChange" />
        </label>
        <div v-if="isPending">Uploading...</div>
      </div>
  </template>
  
  <script setup>
  import { ref, watchEffect, defineProps, defineEmits, defineExpose } from 'vue';
  import useStorage from '@/composables/useStorage';
  import useCollection from '@/composables/useCollection';

  const props = defineProps({
    collection_name: String
  });

  // Track if a file is selected
  const isFileSelected = ref(false);

  // Call this method when the file is chosen
  const handleFileSelection = (event) => {
    isFileSelected.value = event.target.files.length > 0;
    console.log("isFileSelected ", isFileSelected.value)
  };

  const emit = defineEmits(["file-submitted"]);
  
  // File & form state
  const file = ref(null);
  const fileInput = ref(null);
  const isPending = ref(false);
  const fileSelectedError = ref(null);
  const imageMetaData = ref(null);
  const types = ["image/png", "image/jpeg"];
  
  // Storage & Firestore composables
  const { url, error: fileError, filePath, uploadImage } = useStorage();
  const { error: errorImageMetadata, addDocImp } = useCollection("images_metadata");
  
  // Handle file selection
  const handleChange = (e) => {
    const selected = e.target.files[0];
    
    handleFileSelection(e)
    
    if (selected && types.includes(selected.type)) {
      file.value = selected;
    } else {
      file.value = null;
      fileInput.value.value = "";
      fileSelectedError.value = "Please select a valid file (PNG or JPEG).";
    }
  };
  
  // Handle file submission (exposed to parent)
  const triggerSubmit = () => {
    handleSubmit()
  }


  const handleSubmit = async () => {
    if (!file.value) {
        fileSelectedError.value = "No file selected.";
        return;
    }
  
    isPending.value = true;
  
    imageMetaData.value = {
      role: "main",
      identifier_id: "",
      updated_by: "admin",
      tags: [],
    };

    console.log("collection name ", props.collection_name)
  
    await uploadImage(file.value, props.collection_name);
  };
  
  // Watch for upload completion & save metadata
  watchEffect(async () => {
    if (url.value) {
      console.log("url ", url.value)
      imageMetaData.value.image_url = url.value;


      const docId = await addDocImp(imageMetaData.value);

      if (docId){
        emit("file-submitted", { status: "success", id: docId.id });
      }
      else{
        emit("file-submitted", { status: "failure", id: docId });
      }
  
      isPending.value = false;
      cleanForm();
    }
    else{
      console.log("empty url")
    }
  });
  
  // Clear form
  const cleanForm = () => {
    console.log("clean images")
    file.value = null;
    fileInput.value.value = "";
  };
  
  // Expose function to parent
  defineExpose({ triggerSubmit, isFileSelected });
  </script>
  