<template>
  <form @submit.prevent="triggerUpload">
    <UploadImages ref="uploadImageRef" @file-submitted="handleFileSubmission" 
          collection_name="general"   :dropdownOptions="['main', 'sub']"
    />
    <div class="flex justify-center items-center  ">
      <button class="shrink p-2 btn bg-blue-500 text-white rounded-xl font-bold">Submit from Parent</button>
    </div>
  </form>

  <form @submit.prevent="moveFileHandler">
    <div class="mt-10 flex justify-center items-center gap-4">
      <div>
        <label class="block text-sm font-medium mb-1" for="source">File Name</label>
        <input
          id="source"
          v-model="fileName"
          type="text"
          placeholder="e.g., temp/uploads/"
          class="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1" for="destination">Destination Folder</label>
        <input
          id="destination"
          v-model="destinationFolder"
          type="text"
          placeholder="e.g., public/images/"
          class="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1" for="destination">Destination File</label>
        <input
          id="destination"
          v-model="destinationFile"
          type="text"
          placeholder="e.g., file.png"
          class="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

    </div>
    <div class="flex justify-center mt-4">
      <button class="shrink btn bg-blue-500 text-white rounded-xl font-bold p-2" type="submit">Move File</button>
    </div>
  </form>
  <div>
    <div v-if="errorMoveFile" class="flex justify-center mt-4">
      <p>{{errorMoveFile}}</p>
    </div>
  </div>

  <div class="flex flex-col items-center justify-center mt-6">
    <button @click="handleCleanIMagesMetadata" class="shrink btn bg-blue-500 text-white rounded-xl font-bold p-2"> Clean Images Metadata</button>
    <div v-if="imageCleanerMsg">
      {{ imageCleanerMsg }}
    </div>
    <div v-if="imagesCleanerStatus === 'end'">
      <div v-for="deletedImage in deletedImagesDocs" :key="deletedImage.id">
        <p>id {{ deletedImage.id }} url {{ deletedImage.url }}</p>
      </div>
    </div>
  </div>
  </template>
  
  <script setup>
  import { ref, computed} from 'vue';
  import { getApp } from 'firebase/app';

  
  import { getFunctions, httpsCallable } from "firebase/functions";
  import useImageMetadata from '@/composables/fetchImageMetadata';
  
  import UploadImages from '@/components/UploadImages.vue'
  import getUser from '@/composables/getUser';
  import { functions } from '@/firebase/config'
  import useDocument from '@/composables/useDocument';

  const { user , projectAuth} = getUser()

  const { error, isPending, _updateDoc, _docExists, _deleteDoc } = useDocument("images_metadata")

  const { imagesMetadata, error: errorImagesMetadata, fetchImageMetadata } = useImageMetadata();

  
  const fileName = ref("")
  const destinationFolder = ref("general")
  const destinationFile = ref("")
  const messageMoveFile = ref("")
  const errorMoveFile = ref(null)
  const deletedImagesDocs = ref([])
  const imagesCleanerStatus = ref(null)
  
  const moveFileHandler = async () => {

    imagesCleanerStatus.value = null
    console.log("auth ", projectAuth.value)

    const token = await user.value.getIdToken(true)

    
    console.log("token", token)
    
    errorMoveFile.value = null;
    
    if (!imagesMetadata?.value?.length) {
      errorMoveFile.value = "Images metadata hasn't loaded yet";
      return;
    }
    
    const matchedDoc = imagesMetadata.value.filter(doc => doc.image_url?.includes(fileName.value))
    if (!matchedDoc.length) {
      errorMoveFile.value = `No matching document found for: ${fileName.value}`;
      fileName.value = "";
      return;
    }
    console.log("Found document:", matchedDoc);
    
    const fullOriginPath = `images/undefined/${fileName.value}`; // or wherever your file is
    const fullNewPath =  `images/${destinationFolder.value}/${destinationFile.value}`;

    
    const response = await fetch(
      'https://us-central1-questioner-db50f.cloudfunctions.net/moveImageHttps',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            oldPath: fullOriginPath,
            newPath: fullNewPath
          }
        }),
      }
    );

    console.log(response)

    if (!response.ok)
    {
      errorMoveFile.value = "error during process";

    }
    else{
      const result = await response.json();
      console.log("Moved file URL:", result.url);
      matchedDoc.map( async item => {
        let update = { image_url : result.url}
        await _updateDoc(update, item.id )
      })
    }
  }
  
  const triggerUpload = () => {
    if (uploadImageRef.value) {
      uploadImageRef.value.triggerSubmit(); // Calls the child's method
    }
  };

  const handleFileSubmission = ({ role, files }) => {
    console.log(`Role: ${role}`);
    files.map(item => console.log(item))
    };

  const handleCleanIMagesMetadata = (() => {

    if (!imagesMetadata.value?.length){
      imagesCleanerStatus.value = "not ready"
    }
    imagesCleanerStatus.value = "progress"
    imagesMetadata.value?.forEach(async element => {
      let valid = await checkImage(element.image_url)
      if (!valid){
        console.log("delete doc", element.image_url)
        deletedImagesDocs.value.push({id: element.id, url: element.image_url })
        await _deleteDoc(element.id)
      }
      else{
        console.log("valid doc", element.image_url)

      }
    });
    imagesCleanerStatus.value = "end"
  })

  const imageCleanerMsg = computed(() => {
    if (imagesCleanerStatus.value === "not ready"){
      return "WAIT FOR PAGE TO LOAD"
    }
    else if (imagesCleanerStatus.value === "progress"){
      return "CLEANING PROGRESS"
    }
    else if (imagesCleanerStatus.value === "end")
     return "FINISH CLEANING"

     else return null

  })

  function checkImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }
  </script>
  