<template>
  <div v-for="project in project_data" :key="project.translations.en.title">
    <p>
      title {{ project.title  }}
    </p>
    <p>
      sub title {{ project.sub-title  }}
    </p>

  </div>
</template>

<script>
import {ref } from "vue"
import projects from '@/data_simulataion/projects.json'

const projects_data = ref( Object.entries(projects))

</script>

<style>

</style>