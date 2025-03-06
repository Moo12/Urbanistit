<template>
  <div>
    <h1>Editing: {{ sectionDisplay.name }}</h1>
    <p>ID: {{ sectionDisplay.id }}</p>
    <!-- Add your editing UI here -->
    <ContentEditorTest v-if="data" :section="data" @save="handleSave"/>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import ContentEditorTest from './ContentEditorTest.vue';
import useDocument from '@/composables/useDocument';
import useCollection from '@/composables/useCollection';
import general_data from "./general_content.json"

const route = useRoute();
const props = defineProps({
  section: Object
});

const alldata = ref(general_data)

const { error, _deleteDoc, isPending, _updateDoc, _docExists } = useDocument('general_content')

const  { error : errorUseCollection , addDocImp } = useCollection('general_content')


const data = ref(null)

onMounted(() => {
  console.log('Content Editor mounted')
  mountAgain(route.params.id)// Initialize section & data when the component is mounted
})
    
const mountAgain = ((id)=> {
    console.log('id', route.params.id)
    
    if (alldata.value.hasOwnProperty(id)) {
      data.value = alldata.value[id];
  
      console.log('data changes', alldata.value[id] )
    } else {
      console.error(`Error: Key '${id}' not found in alldata.`);
    }
});

const handleSave = async () => {
  try {
    const id = props.section?.id?.toString().trim()
    console.log('handleSave. id: ', id)
    console.log( 'save content in chold: ', data.value)
  
    const exists = await _docExists(id);
    if (exists) {
        await _updateDoc(data.value, id);
        console.log(`Document with ID ${id} updated successfully.`);
    } else {
        console.log(`Document with ID ${id} does not exist.`);
        await addDocImp(data.value, id)
    }
  } catch (error) {
        console.error("Error in handleSave:", error);
  }
};

const sectionDisplay = ref(props.section || {
  id: route.params.id,
  name: route.query.name,
  type: route.query.type
});

onBeforeRouteUpdate((to, from) => {
  console.log(`Route changed from ${from.params.id} to ${to.params.id}`);

  const id = to.params.id

  sectionDisplay.value = {
      id: to.params.id,
      name: to.query.name,
      type: to.query.type
  }

  mountAgain(id)
});

</script>

