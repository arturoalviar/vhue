<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    role="img"
  >
    <use v-bind="{'xlink:href': svgFullName}"/>
  </svg>
</template>

<script>
export default {
  name: 'light-icon',
  props: ['name', 'filename'],
  data() {
    return {
      file: this.filename || 'lights',
    };
  },
  computed: {
    svgFullName() {
      return `static/${this.file}.svg#${this.name}`;
    },
  },
};
</script>
