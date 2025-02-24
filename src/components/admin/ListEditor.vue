<template>
  <ContentEditorTest :section="data" @save="handleSave"/>
</template>

<script>
import { onMounted, watch, ref } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import ContentEditorTest from './ContentEditorTest.vue';

export default {
  components: {
    ContentEditorTest
  },
  props: {
    section: {
      type: Object,
      required: false,
    }
  },
  
  setup(props){
    const data = ref( 
    {
      "id": "contact_me",
      "metadata": {
        "last_update": "",        // Timestamp of the last update
        "updated_by": "",         // User who last updated the data
        "created_at": "",         // Timestamp of creation
        "created_by": "",         // User who created the entry
        "user_opener": "",        // User currently editing/viewing the section
        "status": "active",       // Status (e.g., active, archived, draft)
      },
      "data": {
        "en": {
          "email": "example@email.com",
          "phone": "+1234567890",
          "description": "Feel free to reach out to us!",
          "isActive": true,
          "contact_hours": "Mon-Fri 9AM - 5PM",
          "response_time": 24,
          "form_fields": [
            { "label": "Name", "type": "text", "required": true },
            { "label": "Email", "type": "email", "required": true },
            { "label": "Phone Number", "type": "text", "required": false },
            { "label": "Message", "type": "textarea", "required": true },
          ]
        },
        "he": {
          "email": "example@email.com",
          "phone": "+972-54-1234567",
          "description": "אל תהססו לפנות אלינו!",
          "isActive": true,
          "contact_hours": "א'-ה' 9:00 - 17:00",
          "form_fields": [
            { "label": "שם", "type": "text", "required": true },
            { "label": "אימייל", "type": "email", "required": true },
            { "label": "מספר טלפון", "type": "text", "required": false },
            { "label": "הודעה", "type": "textarea", "required": true },
          ]
        }
      }
  })

    const route = useRoute();
    
    // Use either props.section or fallback to route parameters
    const section = ref(props.section || {
      id: route.params.id,
      name: route.query.name,
      type: route.query.type
    });


    onBeforeRouteUpdate((to, from) => {
      console.log(`Route changed from ${from.params.id} to ${to.params.id}`);
      section.value = {
          id: to.params.id,
          name: to.query.name,
          type: to.query.type}
      
        fetchData(to.params.id);
    });

  const  fetchData = (newId) => {
    console.log(`Fetching data for ID: ${newId}`);
    
    // Your API call or data loading logic
  }

  const handleSave = () => {
    console.log ('handleSave')
  }

  onMounted(() => {
    console.log('List Editor mounted')
  })

    return {section, data, handleSave}
  }
}

</script>

