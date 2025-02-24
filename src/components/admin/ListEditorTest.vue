<script setup>
import { ref, defineProps, onMounted, computed } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import blog_metadata from "./blog_mt.json";
import useCollectionOptions from '@/composables/useCollectionOptions.js';
import getCollection from "@/composables/getCollection";

const config = ref(blog_metadata);
const route = useRoute();

const props = defineProps({
  section: Object
});

// Ensure `sectionDisplay` is reactive and falls back to route parameters if `props.section` is not provided
const sectionDisplay = ref(props.section || {
  id: route.params.id,
  name: route.query.name,
});

const isPending = ref(false)
const pendingString = ref("")

// Store the form data
const formData = ref({});
const commonFormData = ref({});

const dynamicOptions = ref({});

// Fetch options dynamically if needed
const fetchOptions = async (field, id) => {
  if (field.options_source === "database") {
    // Simulate fetching from database (repla.ce with API call if needed)
    
        const  { options, error, fetchOptions } = useCollectionOptions(field.source_collection, field.field_title_name )

        await fetchOptions()

        console.log ("fetch options;", options.value)
        dynamicOptions.value[id] = options.value
    }
}

const initializeFormData = async (id) => {

    const sectionConfig = config.value[id];

    if (!sectionConfig) return;

    // Initialize commonFormData (non-language fields)
    commonFormData.value = {};
    if (sectionConfig.common_data) {
        for (const [fieldId, field] of Object.entries(sectionConfig.common_data)) {
        commonFormData.value[fieldId] = field.type === "multi_select" ? [] : "";
        }
    }

    // Initialize formData for language-specific fields
    formData.value = {
        languages: sectionConfig.languages.reduce((acc, lang) => {
        acc[lang] = {};
        return acc;
        }, {})
    };

    // Initialize language-specific fields
    if (sectionConfig.data) {
        for (const [fieldId, field] of Object.entries(sectionConfig.data)) {
        for (const lang of sectionConfig.languages) {
            formData.value.languages[lang][fieldId] = field.type === "multi_select" ? [] : "";
        }
        }
    }

    // Fetch dynamic options for both commonFormData and language-specific fields
    for (const fieldSet of [sectionConfig.common_data, sectionConfig.data]) {
        if (!fieldSet) continue;
        
        for (const [fieldId, field] of Object.entries(fieldSet)) { // Get both key (ID) and value (field)
            if (field.options_source === "database") {
                await fetchOptions(field, fieldId); // Pass fieldId along with field data
            }
        }
    }
};

// Run initialization on mount
onMounted(() => initializeFormData(sectionDisplay.value.id));

// Handle route updates dynamically
onBeforeRouteUpdate((to) => {
  sectionDisplay.value = {
    id: to.params.id,
    name: to.query.name,
  };
  
  initializeFormData(to.params.id);
});

const constructSaveObject = () => {
    const id = props.section?.id?.toString().trim()

    const sectionConfig = config.value[id];
    if (!sectionConfig) return null;

    const saveObject = {
        default: {},
        translations: {},
        metadata: {
            updated_by: "", // Populate with the current user
            created_by: "", // Populate with the creator
            user_opener: "", // User currently editing
            status: "active",
            readonly: false
        }
    };

    // Add common data (default non-language fields)
    if (commonFormData.value) {
        for (const [fieldId, value] of Object.entries(commonFormData.value)) {
            saveObject.default[fieldId] = value;
        }
    }

    // Add language-specific fields
    if (formData.value.languages) {
        for (const [lang, fields] of Object.entries(formData.value.languages)) {
            saveObject.translations[lang] = {};

            for (const [fieldId, value] of Object.entries(fields)) {
                saveObject.translations[lang][fieldId] = value;
            }
        }
    }

    return saveObject;
};

const isLoading = computed(() => {
    const sectionId = sectionDisplay.value?.id;
    const sectionConfig = config.value[sectionId];

    if (!sectionConfig) {
        console.error("failed to load data")
        return false; // Prevent errors if sectionConfig is undefined
    }

    return sectionConfig.languages.every(lang => 
        formData.value.languages?.[lang] &&
        Object.keys(formData.value.languages?.[lang] || {}).length === Object.keys(sectionConfig?.data || {}).length
    ) &&
    commonFormData.value &&
    Object.keys(commonFormData.value || {}).length === Object.keys(sectionConfig?.common_data || {}).length;
});

const clearFormValues = () => {
  // Clear commonFormData values
  Object.keys(commonFormData.value).forEach(key => {
    commonFormData.value[key] = Array.isArray(commonFormData.value[key]) ? [] : "";
  });

  // Clear formData language-specific values
  if (formData.value.languages) {
    Object.keys(formData.value.languages).forEach(lang => {
      Object.keys(formData.value.languages[lang]).forEach(key => {
        formData.value.languages[lang][key] = Array.isArray(formData.value.languages[lang][key]) ? [] : "";
      });
    });
  }
};


const handleSave = async () => {
  try {
    isPending.value = true
    pendingString.value = `saving ${sectionDisplay.value?.name}`


    const id = sectionDisplay.value?.id

    console.log('handleSave. id: ', id)
    console.log( 'save content. form data ', formData.value)
    console.log( 'common data ', commonFormData.value)
    const objToSave = constructSaveObject()
   
    console.log("object to save", objToSave)

    const  { error : errorUseCollection , addDocImp } = useCollection(id)

    await addDocImp(objToSave)
    clearFormValues()
    
    } catch (error) {
        console.error("Error in handleSave:", error);
    }

    pendingString.value = ""
    isPending.value = false;
};

</script>


<template>
    <div  class="p-5 max-w-2xl mx-auto"
            v-if="isLoading"
            >
            <h2 class="text-2xl font-bold mb-4">Add {{ sectionDisplay.name }} </h2>
            <form @submit.prevent="handleSave" class="space-y-4">
                <!-- common data -->
                <div v-if="config[sectionDisplay.id]?.common_data">
                    <div v-for="([fieldId, field]) in Object.entries(config[sectionDisplay.id]?.common_data)" :key="fieldId">
                        <label :for="fieldId" class="block text-sm font-medium">
                            {{ field.label || fieldId }}
                        </label>

                        <!-- Select Input -->
                        <select 
                            v-if="field.type === 'select'"
                            v-model="commonFormData[fieldId]" 
                            :id="fieldId"
                            class="border p-2 w-full rounded"
                            >
                            <option v-for="option in field.options" :key="option" :value="option">
                                {{ option }}
                            </option>
                        </select>

                        <!-- Multi-Select (Static or Database-Driven) -->
                        <div v-else-if="field.type === 'multi_select'">
                            <div class="flex flex-col gap-2">
                                <label 
                                    v-for="option in (field.options_source === 'static' 
                                        ? field.options 
                                        : dynamicOptions[fieldId] || [])"
                                    :key="option.id"
                                    class="inline-flex items-center space-x-2 border px-3 py-1 rounded cursor-pointer"
                                >
                                    <input 
                                        type="checkbox"
                                        :value="option.id"
                                        v-model="commonFormData[fieldId]"
                                        class="accent-blue-500"
                                    />
                                    <span>{{ option.title }}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Per-Language Fields -->
                <div v-for="([fieldId, field]) in Object.entries(config[sectionDisplay.id]?.data)" :key="fieldId">
                    <label :for="fieldId"> {{ field.label }}</label>
                    <div v-for="lang in config[sectionDisplay.id]?.languages" 
                    :key="lang" 
                    class="mb-4 border p-4 rounded"
                    >
                        <label class="text-xs text-gray-500">{{ lang.toUpperCase() }}</label>
                        <!-- Text Input -->
                        <input
                            v-if="field.type === 'text'" 
                            v-model="formData.languages[lang][fieldId]" 
                            :id="`${fieldId}_${lang}`"
                            type="text" 
                            class="border p-2 w-full rounded" 
                            />

                        <!-- Textarea Input -->
                        <textarea 
                        v-else-if="field.type === 'textarea'" 
                        v-model="formData.languages[lang][fieldId]" 
                        :id="`${fieldId}_${lang}`" 
                        class="border p-2 w-full rounded h-24 resize-none"
                        ></textarea>
            
                        <!-- Timestamp Input -->
                        <input 
                        v-else-if="field.type === 'timestamp'" 
                        v-model="formData.languages[lang][fieldId]" 
                        :id="`${fieldId}_${lang}`" 
                        type="datetime-local" 
                        class="border p-2 w-full rounded"
                        />
                    </div>
                </div>
                <button type="submit" class="btn" :disabled="isPending">
                    {{ isPending ? pendingString : 'Save Form' }}
                </button>
            </form>
    </div>
    <div v-else>
        Loading Form
    </div>
</template>