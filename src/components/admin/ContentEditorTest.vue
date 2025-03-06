<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import ArrayEditor from "./ArrayEditor.vue";

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["save"]);

// Save emits
const saveData = () => {
  emits("save");
};

// Get the first locale dynamically (fallback to English)
const currentLocale = ref(Object.keys(props.section.translations)[0]);
const sectionData = ref({ ...props.section.translations[currentLocale.value] });

// Watch locale change and update sectionData

watch(currentLocale, (newLocale) => {
  sectionData.value = { ...props.section.translations[newLocale] };
});

watch(() => props.section, (newSection) => {
  sectionData.value = { ...newSection.translations[currentLocale.value] };
}, { immediate: true });

// Handle form submission
const updateSection = () => {
  console.log("Updated section data:", sectionData.value);
};



</script>

<template>
  <div class="admin-pannel">
    <div class="flex flex-col items-center">
      <p class="header-title-sub text-center">Edit Section</p>
      <p class="header-title-sub text-center">{{ section.id }}</p>
    </div>

    <!-- Locale Switcher -->
    <label>Select Language:</label>
    <select v-model="currentLocale">
      <option v-for="(value, locale) in props.section.translations" :key="locale" :value="locale">
        {{ locale.toUpperCase() }}
      </option>
    </select>

    <hr />

    <!-- Form for updating section -->
    <form @submit.prevent="saveData">
      <div v-for="(field, key) in sectionData" :key="key">
        <!-- Handle simple fields with readonly check -->
        <div v-if="typeof field.value !== 'object' && !Array.isArray(field.value)" class="flex gap-3 justify-start justify-items-center items-center">
          <label >{{ key }}</label>
          <div class="flex justify-items-center">
              <input v-if="typeof field.value === 'string'" v-model="field.value" :readonly="field.readonly" type="text" />
              <input v-if="typeof field.value === 'number'" v-model.number="field.value" :readonly="field.readonly" type="number" />
              <input v-if="typeof field.value === 'boolean'" v-model="field.value" :disabled="field.readonly" type="checkbox" />
          </div>
        </div>
        
        <!-- Handle arrays separately using ArrayEditor -->
        <ArrayEditor v-else-if="Array.isArray(field.value)" :modelValue="field.value" :readonly="field.readonly" />
            
        <!-- Handle nested objects dynamically -->
        <div v-else-if="typeof field.value === 'object'" class="nested-object">
          <h3>{{ key }} nested </h3>
          <div v-for="(subField, subKey) in field.value" :key="subKey">
            <label>{{ subKey }}</label>
            <input v-if="typeof subField.value === 'string'" v-model="subField.value" :readonly="subField.readonly" type="text" />
            <input v-if="typeof subField.value === 'number'" v-model.number="subField.value" :readonly="subField.readonly" type="number" />
            <input v-if="typeof subField.value === 'boolean'" v-model="subField.value" :disabled="subField.readonly" type="checkbox" />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit" :disabled="section.metadata?.readonly">Save Changes</button>
    </form>
  </div>
</template>

<style scoped>
.nested-object {
  padding-left: 15px;
  border-left: 2px solid #ddd;
  margin-bottom: 10px;
}
button {
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
button:hover {
  background-color: #0056b3;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
