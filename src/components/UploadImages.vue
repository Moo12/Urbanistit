<template>
    <div class="flex flex-col justify-center justify-items-center gap-4 items-center">
      <!-- File input -->
         <p class="text-center">
           <input type="file" ref="fileInput" @change="handleChange" multiple />
         </p>
      <!-- Dropdown Selector -->
       <div v-if="hasDropdown" class="flex flex-col gap-1 items-center">
          <p class="section-content">Choose Images Role:</p>
         <label>
           <select v-model="selectedOption" class="section-content p-2 self-center">
             <option v-for="option in dropdownOptions" :key="option" :value="option">
               {{ option }}
             </option>
           </select>
         </label>
       </div>

      <!-- Uploading Status -->
      <div v-if="isPending">Uploading...</div>

      <!-- File Upload Progress -->
      <ul v-if="uploadStatus.size">
        <li v-for="[fileName] in uploadStatus.entries()" :key="fileName" class="flex flex-row justify-between gap-2">
          <p>{{ fileName }}</p>
          <p
            :class="{
            'text-green-500': uploadStatus.get(fileName) === STATUS_STRING.UPLOADED,
            'text-red-500': uploadStatus.get(fileName) === STATUS_STRING.FAILURE,
            'text-gray-500': !uploadStatus.get(fileName) || uploadStatus.get(fileName) === STATUS_STRING.PENDING}">
            {{ uploadStatus.get(fileName) || STATUS_STRING.PENDING }}
          </p>
        </li>
      </ul>
      <div v-if="fileSelectedError">
        <p> {{ fileSelectedError }}</p>
      </div>
    </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, defineExpose, computed} from 'vue';
import useStorage from '@/composables/useStorage';
import useCollection from '@/composables/useCollection';

const props = defineProps({
  collection_name: String,
  dropdownOptions: Array // List of dropdown options from parent
});

const STATUS_STRING = {
      UPLOADED: 'Uploaded',
      FAILURE: 'Failure',
      PENDING: 'Pending',
}

const emit = defineEmits(["file-submitted"]);

// File state
const files = ref([]);
const fileInput = ref(null);
const isPending = ref(false);
const fileSelectedError = ref(null);
const selectedOption = ref(props.dropdownOptions?.[0] || ""); // Default to first option

const types = ["image/png", "image/jpeg",];
const uploadStatus = ref(new Map()); // Tracks upload status of each file
const uploadedFinalStatus = ref(new Map())

const AreFileSelected = ref(false);

const { filesUploadedInfo, error: fileError, uploadImages } = useStorage();
const { addDocImp } = useCollection("images_metadata");

const hasDropdown = computed(() => Array.isArray(props.dropdownOptions) && props.dropdownOptions.length > 0);


// Handle file selection
const handleChange = (e) => {
  const selectedFiles = Array.from(e.target.files);

  uploadStatus.value = new Map() 

  // Validate files and update the list
  files.value = selectedFiles.filter(file => types.includes(file.type));

  AreFileSelected.value = files.value.length > 0;


  if (files.value.length === 0) {
    fileSelectedError.value = "Please select valid PNG or JPEG files.";
  } else {
    fileSelectedError.value = null;
  }
};

const triggerSubmit = () => {
  handleSubmit()
}

// Upload all selected files
const handleSubmit = async () => {
  if (!files.value.length) {
    fileSelectedError.value = "No files selected.";
    return;
  }

  isPending.value = true;

  files.value.forEach((file) => {
    uploadStatus.value.set(file.name, "Uploading...");
  });

  uploadedFinalStatus.value = new Map();

  uploadImages(files.value, props.collection_name);
}

// Wait for URL and save metadata
watch( filesUploadedInfo, async () => {
  if (files.value.length) {
    const promises = [];

    for (const fileUploaded of filesUploadedInfo.value) {

      console.log("iterating file ", fileUploaded.name )
      const promise = (async () => {
        if (!uploadedFinalStatus.value.has(fileUploaded.name)) {
          uploadedFinalStatus.value.set(fileUploaded.name, { status: STATUS_STRING.PENDING, id: "" });

          const imageMetaData = {
            role: "main",
            identifier_id: "",
            updated_by: "admin",
            tags: [],
            image_url: fileUploaded.url,
            category: props.collection_name || "general",
          };

          try{
            const docId = (await addDocImp(imageMetaData)).id;

            console.log("image metadata was added: ",  docId.id)


            uploadedFinalStatus.value.set(fileUploaded.name, { id: docId, status: docId ? "success" : "failure"})
            
            uploadStatus.value.set(fileUploaded.name , docId ? STATUS_STRING.UPLOADED : STATUS_STRING.FAILURE);
          }
          catch{
            console.error("Error uploading file:", fileUploaded.name, error);
            uploadedFinalStatus.set( fileUploaded.name,  { status: "failure"});
            uploadStatus.value.set(fileUploaded.name,  STATUS_STRING.FAILURE);
          }
        }
      })();
      promises.push(promise);
    }

    await Promise.all(promises);

    const filesArray = Array.from(uploadedFinalStatus.value.entries()).map(([key, value]) => ({
      fileName: key,
      ...value
    }));

    // Convert the Map to an array and add fileName field
    const allFilesUploaded = !filesArray.some(file => file.status === STATUS_STRING.PENDING);
    
    if (uploadedFinalStatus.value.size === files.value.length && allFilesUploaded) {
      console.log("emit file-submitted")
      emit("file-submitted", { role: selectedOption.value, files: filesArray });
      isPending.value = false;
      cleanForm();
    }
  }
});


// Clear form
const cleanForm = () => {
  console.log("clean images list")
  fileInput.value.value = "";
  files.value = []
  uploadedFinalStatus.value = new Map()
  AreFileSelected.value = files.value.length > 0;
};

// Expose function to parent
defineExpose({ triggerSubmit, AreFileSelected });
</script>
