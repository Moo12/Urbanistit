<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Array, // Change from Array to Object since it's { value, readonly }
    required: true,
  },
});

// Extract the array value
const fields = ref([...props.modelValue]);

// Watch for changes in props to keep the local ref updated
watch(() => props.modelValue, (newVal) => {
  fields.value = [...newVal];
});


// Add new field
const addField = () => {
  fields.value.push({ label: "", type: "text", required: false });
};

// Remove a field
const removeField = (index) => {
  fields.value.splice(index, 1);
};
</script>

<template>
  <div class="array-editor">
    <div v-for="(field, index) in fields" :key="index" class="field-row">
      <input v-model="field.label" placeholder="Field Label" />
      <select v-model="field.type">
        <option value="text">Text</option>
        <option value="email">Email</option>
        <option value="textarea">Textarea</option>
        <option value="checkbox">Checkbox</option>
      </select>
      <input type="checkbox" v-model="field.required" />
      <button @click="removeField(index)">Remove</button>
    </div>

    <button @click="addField">Add Field</button>
  </div>
</template>

<style scoped>
.array-editor {
  margin-top: 20px;
}
.field-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
input, select {
  padding: 5px;
}
</style>
