<template>
    <div v-if="!loading">
        <div class="flex justify-center">
          <p class="header-title"> {{ collectionName }}</p>
        </div>  
        <div v-if="items" class="grid grid-cols-3 gap-3">
          <div v-for="item in items" :key="item.id" class="border-4 flex flex-col justify-between">
            <SingleItem  :item="item" :metadata="metadataCollection" lang="en" :databaseFieldOptions="dynamicOptions"/>
            <div class="flex justify-center gap-3">
              <button @click="handleEditItem(item)" class="btn border-4">
                <span>Edit</span>
              </button>
              <div v-if="status.action === 'delete' && item.id === activeItem.id" class="flex justify-center items-center mt-4">
                <div v-if="status.result === 'pending'">
                  <span class="spinner"></span> <!-- Add a spinner for pending state -->
                  <p class="ml-2">{{ status.message }}</p>
                </div>
                <div v-else-if="status.result === 'failure'" class="flex justify-center items-center mt-4 text-green-500">
                  <p>{{ status.message }}</p>
                  <button @click="setInitStatus">X</button>
                </div>
              </div>
              <div v-else>
                <button @click="handleDeleteItem(item)" class="btn border-4">
                  <span>Delete</span>
                </button>
                            <!-- Show status information -->
              <div v-if="status.result === 'pending' && status.action === 'delete'" class="flex justify-center items-center mt-4">
                <span class="spinner"></span> <!-- Add a spinner for pending state -->
                <p class="ml-2">{{ status.message }}</p>
              </div>

              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-7">
            <button @click="handleCreateItem" class="btn border-4">
                  <span>Create Item</span>
            </button>
        </div>

         <!-- Modal for Create/Edit --> 
        <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100">
          <div class="bg-white p-6 rounded-lg  h-[90vh] overflow-y-auto">
            <!-- Show status information -->
            <SingleItemForm :item="activeItem" :metadata="metadataCollection" lang="en" 
            :databaseFieldOptions="dynamicOptions" :action=currentAction  
            :collection_name="collectionId" @save="handleSaveItem"
            :save_states="SAVE_STAGES"/>

            <!-- Show status information -->
            <div v-if="status.result === 'pending'" class="flex justify-center items-center mt-4">
              <span class="spinner"></span> <!-- Add a spinner for pending state -->
              <p class="ml-2">{{ status.message }}</p>
            </div>
            
            <div v-else-if="status.result === 'success'" class="flex justify-center items-center mt-4 text-green-500">
              <p>{{ status.message }}</p>
            </div>
            
            <div v-else-if="status.result === 'failure'" class="flex justify-center items-center mt-4 text-red-500">
              <p>{{ status.message }}</p>
            </div>
            <button @click="handleCloseEditModal" class="btn border-4">Close</button>
          </div>
        </div>
    </div>
    <div v-else>
        Loading...
    </div>
    <div v-if="errorString">
        <p>{{ errorString }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import getCollection from '@/composables/getCollection';
import useCollectionOptions from '@/composables/useCollectionOptions.js';
import useDocument from '@/composables/useDocument';
import useCollection from '@/composables/useCollection';

import SingleItem from "./SingleItem.vue"
import SingleItemForm from './SingleItemForm..vue';

import blog_metadata from "./blog_mt.json";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: String
});

const SAVE_STAGES = {
      START: 'START',
      PROCESS: 'PROCESS',
      END: 'END',
}

const loading = ref(false)

const route = useRoute();

const errorString = ref("")

const collectionId = ref("")

const collectionName = ref("") 

const config = ref(null)

const { documents : items, error, subscribeToCollection, fetchCollectionOnce } = getCollection("");

const metadataCollection = ref(null)

const dynamicOptions = ref({});

const currentAction = ref("readonly"); // "readonly" | "edit" | "create"
const activeItem = ref(null); // Stores the item being edited/created
const isModalOpen = ref(false); // Controls modal visibility

const status = ref({})

const { error : errorUseDocument, _deleteDoc, isPending: isPendingEdit, _updateDoc, _docExists, setCollectionName: setCollectionNameOfDOoc } = useDocument();
const  { error : errorUseCollection , addDocImp, setCollectionName: setCollectionName } = useCollection()

const loadItems = async (_collectionId, _collectionName) => {
    status.value = {
    action: '',   // 'edit', 'delete', 'create'
    result: '',   // 'pending', 'success', 'failure'
    message: ''   // Optional message for status (e.g., error or success message)
    };

    loading.value = true
    collectionId.value = _collectionId
    collectionName.value = _collectionName || _collectionId;
    errorString.value = ""
    config.value = blog_metadata[collectionId.value]
    
    if (!config.value){
        errorString.value = `Severe Error - Could not load  for collection ${collectionId.value}`
        console.error(errorString.value)
    }

    //await fetchCollectionOnce(collectionId.value)
    subscribeToCollection(collectionId.value)
    setCollectionName(collectionId.value)
    setCollectionNameOfDOoc(collectionId.value)

    metadataCollection.value = await fetchMetadataCollection(collectionId.value)

    if (!metadataCollection.value){
      errorString.value = `Severe Error - Could not load metadata  for collection ${collectionId.value}`
      console.error(errorString.value)
      return;
    }

    loadOptions()

    loading.value = false
};

const loadOptions = async () => {

  if (!metadataCollection.value){
    console.error("metadata is empty. exit options laoding")
    return
  }
  // Fetch dynamic options for both commonFormData and language-specific fields
  for (const fieldSet of [metadataCollection.value.common_data, metadataCollection.value.data]) {
    if (!fieldSet) continue;
    
    for (const [fieldId, field] of Object.entries(fieldSet)) { // Get both key (ID) and value (field)
        if (field.options_source === "database") {
            await fetchOptions(field, fieldId); // Pass fieldId along with field data
        }
    }
  }
}

const fetchOptions = async (field, fieldId) => {
  if (field.options_source === "database") {
    const  { options, error, fetchOptions : _fetchOptions } = useCollectionOptions(field.source_collection )

    await _fetchOptions()

    dynamicOptions.value[fieldId] = { all_items: options.value, display_field: field.field_display_name }
    console.log("fetch options;", dynamicOptions.value)
  }
}

onMounted(()=> {
  console.log("collection name: ", props.id || route.params.id)

  loadItems( props.id || route.params.id, props.name || route.query?.name)
})

onBeforeRouteUpdate((to) => {
  loadItems(to.params.id, to.query?.name);
});

const fetchMetadataCollection = async (id) => {
  console.log("metadata ", blog_metadata[id])
  return blog_metadata[id]
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handleCancelItem = (item) => {
  activeItem.value = null
  console.log("handleCancelItem")
  isModalOpen.value = false
}

const handleDeleteItem = async (item) => {
  currentAction.value = "delete"
  activeItem.value = item
  status.value = { action: 'delete', result: 'pending', message: 'Deleting the item...' }; // Set status to 'pending'

  let statusError = { action: 'delete', result: 'failure', message: 'Error Deleting the item. Please try again.' }; // Error

  console.log("handleDeleteItem ", item.id, status.value)
  try{
    await delay(3000)
    _deleteDoc(item.id)
    
    if (!errorUseDocument.value){
      status.value = { action: 'delete', result: 'success', message: 'Item was deleted' };
      setInitStatus()
    }
    else{
      status.value = statusError
    }

  }catch (error) {
    console.error("Error in handleSave:", error);
    status.value = statusError
  }
}

const setInitStatus = () => {
  currentAction.value = "readonly";
  activeItem.value = null; // Stores the item being edited/created

  status.value = { action: '', result: '', message: '' }; // Set init status
  isModalOpen.value = false
}

const handleEditItem = (item) => {
  currentAction.value = "edit"
  activeItem.value = item
  isModalOpen.value = true
  console.log("handleEditItem id", item.id)
}


const handleCloseEditModal = () => {
  setInitStatus()
}

const handleSaveItem = async (item, state) => {
  try {
    
    console.log("handleSaveItem ", item)
    
    setCollectionNameOfDOoc(collectionId.value)
    
    status.value = { action: 'save', result: 'pending', message: state.message || 'saving the item...' };
    
    if (state?.val === SAVE_STAGES.START){
      status.value = { action: 'save', result: 'pending', message: state.message || 'Preparing to save the item...' };
      return;
    }

    
    if (currentAction.value === "create"){
      await addDocImp(item)
      status.value = { action: 'save', result: 'success', message: 'Item created successfully!' }; // Success
    }
    else {
      await _updateDoc(item, item.id);
      status.value = { action: 'save', result: 'success', message: 'Item saved successfully!' }; // Success
      
      console.log(`Document with ID ${item.id} updated successfully.`);
    }
    items.value = null
  } catch (error) {
    console.error("Error in handleSave:", error);
    status.value = { action: 'save', result: 'failure', message: 'Error saving the item. Please try again.' }; // Error

  }
}

const handleCreateItem = () => {
  currentAction.value = "create"
  activeItem.value = {}
  isModalOpen.value = true
  console.log("handleCreateItem")
}

</script>

<style>
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>