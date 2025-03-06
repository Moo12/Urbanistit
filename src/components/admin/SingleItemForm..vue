<script setup>
import { ref, defineProps, defineEmits, watch, computed} from 'vue';
import useSingleItem from "@/composables/useSingleItem.js"
import UploadImagess from '../UploadImages.vue';
import useImageMetadata from '@/composables/fetchImageMetadata'

const props = defineProps({
  item: Object,
  metadata: Object,
  lang: String,
  databaseFieldOptions: Object,
  action: String,
  collection_name: String,
  save_states: Object
});

const emit = defineEmits(["save","update:lang"]);

const { itemRef, metadataRef, getOptions, getFieldValue } = useSingleItem(props);

const { imagesMetadata, error } = useImageMetadata();

const uploadImageRef = ref(null);

// Language selection
const selectedLang = ref(props.lang || metadataRef.value.languages[0]);

// Watch for language changes and emit updates if needed
watch(selectedLang, (newLang) => {
  emit("update:lang", newLang);
});

// Determine whether to show fields for all languages (in create mode) or just the selected language (in edit mode)
const displayedLanguages = (dataEntry) => {
  return computed(() => {
  return props.action === "create" && dataEntry === "data" ? metadataRef.value.languages : [selectedLang.value];
});
} 

const saveChanges = () => {
  console.log("saveChanges ", uploadImageRef.value)
  if (uploadImageRef.value && uploadImageRef.value.AreFileSelected) {
    emit("save", itemRef.value, { val: props.save_states?.START, message: "Uploading Images" });

    triggerUpload(); // Trigger image upload if a file is selected
  } else {
    console.log("no images to uplaod continue to save")
    // If no file is selected, save the changes without uploading an image
    emit("save", itemRef.value, { val: props.save_states?.PROCESS, message: "Saving Item" });
  }
};

const setModelBinding = (dataEntry, fieldName, value, lang) => {
  const fieldValue = dataEntry === "data"
    ? itemRef.value?.translations?.[lang]?.[fieldName]
    : itemRef.value?.default?.[fieldName];

    if (fieldValue !== undefined) {
      if (Array.isArray(fieldValue)) {
        fieldValue.length = 0;  // Clear the array (this is a reference to the same array)
        fieldValue.push(...value);  // Push the new value into the array
      } else {
      if (dataEntry === "data") {
        // If the field is in translations[props.lang], update it
        itemRef.value.translations[lang][fieldName] = value;

      } else if (dataEntry === "common_data") {
        // If the field is in default, update it
        itemRef.value.default[fieldName] = value;
      }
    }
  }
};

const triggerUpload = () => {
    if (uploadImageRef.value) {
      uploadImageRef.value.triggerSubmit(); // Calls the child's method
    }
  };
  
const onFileSubmission = ({ role, files }) => {

  files.map(item => {
  if (item.status === "success"){
      const newImage = {
        metadata_id: item.id, // Store document ID, not URL
        role: role,
      };
      // Step 4: Add image reference to the current document
      if (!Array.isArray(itemRef.value.default.images_metadata)) {
        itemRef.value.default.images_metadata = [];
      }
    
      itemRef.value.default.images_metadata.push(newImage);
    }
  })
  emit("save", itemRef.value, { val: props.save_states?.PROCESS, message: "Saving Item" });
};

const getImageUrl = (id) => {
  let imgMetadata = imagesMetadata.value.filter(img => img.id === id);

  // Check if imgMetadata has any results and return the image_url
  if (imgMetadata.length > 0) {
    return imgMetadata[0].image_url;
  } else {
    // Return a default value or handle the case where the image is not found
    console.warn(`Image with id ${id} not found.`);
    return null; // Or any other default value you'd prefer
  }
}

const removeImage = (index) => {
  // Get the metadata ID of the image to remove
  const imageMetadataId = itemRef.value.default.images_metadata[index].metadata_id;

  // Remove the image from the images_metadata array
  let  newArray = itemRef.value.default.images_metadata.filter(image => image.metadata_id !== imageMetadataId);

  console.log("new images array", newArray)

  // Update the model using setModelBinding (you need to pass the updated value)
  setModelBinding("common_data", "images_metadata", newArray, selectedLang.value);

  console.log(`Removed image with metadata_id: ${imageMetadataId}`);
};

</script>

<template>
  <div v-if="itemRef">
    <!-- Language Selection -->
    <div v-if="action === 'edit'" class="mb-3">
      <label>Select Language:</label>
      <select v-model="selectedLang" class="border p-2 ">
        <option v-for="lang in metadataRef.languages" :key="lang" :value="lang">
          {{ lang.toUpperCase() }}
        </option>
      </select>
    </div>
      
      <!-- Display fields dynamically for each language -->
    

        <form @submit.prevent="saveChanges">
          <h2 class="header-title-sub mb-3">{{ action === "edit" ? `Edit Item ${itemRef.id}`  : "Create New Item" }}</h2>
            <div v-for="([dataEntry, fields_name]) in Object.entries(metadataRef?.display_config?.short_view)" :key="dataEntry" class="mb-3">
              <div v-for="lang in displayedLanguages(dataEntry).value" :key="lang" class="mb-3">
                <p v-if="action === 'create'  && fields_name?.length && dataEntry === 'data'" class="header-title-sub mb-3">
                  {{ lang }}
                </p> 
              <div v-for="field_name in fields_name" :key="field_name" class="mb-3">
                <p class="font-bold">
                  {{ metadataRef?.[dataEntry]?.[field_name]?.label || "no label" }}
                </p>
    
                <!-- Text & Textarea -->
                <input
                  v-if="metadataRef?.[dataEntry]?.[field_name].type_item === 'text' ||
                        metadataRef?.[dataEntry]?.[field_name].type_item === 'textarea'"
                  :value="getFieldValue(dataEntry, field_name, lang).value"
                  @input="setModelBinding(dataEntry, field_name, $event.target.value, lang)"
                  class="border p-2 w-full"
                />
      
                <!-- Select -->
                <select
                  v-else-if="metadataRef?.[dataEntry]?.[field_name].type === 'select'"
                  :value="getFieldValue(dataEntry, field_name, lang).value"
                  @change="setModelBinding(dataEntry, field_name, $event.target.value, lang)"
                  class="border p-2 w-full"
                >
                  <option v-for="option in getOptions(dataEntry, field_name, selectedLang).value.all_items" :key="option.id" :value="option.id">
                    {{ option.title }}
                  </option>
                </select>
                
                <!-- Multi Select -->
                <div v-else-if="metadataRef?.[dataEntry]?.[field_name].type === 'multi_select'">
                  <div v-for="option in getOptions(dataEntry, field_name, selectedLang).value?.all_items" :key="option.id" class="flex gap-2">
                    <input
                      type="checkbox"
                      :value="option.id"
                      :checked="getFieldValue(dataEntry, field_name, lang).value?.includes(option.id)"
                      @change="setModelBinding(dataEntry, field_name, 
                        $event.target.checked 
                        ? [...(getFieldValue(dataEntry, field_name, lang).value || []), option.id] 
                        : getFieldValue(dataEntry, field_name, lang).value.filter(id => id !== option.id), lang)"
                    />
                    <label>{{ option?.title || "Unnamed" }}</label>
                  </div>
                </div>  
              </div>
            </div>
          </div>
            <!-- IMAGE UPLOAD SECTION -->
          <div v-if="metadataRef?.common_data?.images_metadata">
            <h3 class="text-lg font-bold mt-4">Images</h3>
    
            <div v-if=" itemRef?.default?.images_metadata">
              <div v-for="(image, index) in itemRef.default.images_metadata" :key="index" class="border p-2 mb-2">
                <img :src="getImageUrl(image.metadata_id)" class="w-32 h-32 object-cover" alt="Uploaded Image" />
                <p>Role: {{ image.role }}</p>
                            <!-- Select -->
                <!-- <select
                    :value="getFieldValue('common_data', 'images_metadata.role', selectedLang).value"
                    @change="setModelBinding('common_data', 'role', $event.target.value, lang)"
                    class="border p-2 w-full"
                  >
                    <option v-for="option in getOptions('common_data', 'images_metadata.role', selectedLang).value.all_items" :key="option.id" :value="option.id">
                      {{ option.title }}
                    </option>
                  </select> -->
      
                
                <button @click.prevent="removeImage(index)" class="text-red-500">Remove</button>
              </div>
            </div>
    
            <UploadImagess ref="uploadImageRef" :collectionName=collection_name :dropdownOptions="metadataRef.common_data.images_metadata.role.options"  @file-submitted="onFileSubmission" />
          </div>
          <div class="grid justify-center mt-3">
            <button type="submit" class="btn border-5">Save</button>
          </div>
          </form>
  </div>
</template>