<template>
  <svg id="spinner" class="vh-spinner-wrapper" xmlns="http://www.w3.org/2000/svg" viewBox="21.25 21.25 42.5 42.5">
    <circle class="vh-spinner" :class="{'is-light': isLight}" cx="42.5" cy="42.5" r="20" fill="none" stroke-width="2.5" stroke-dasharray="125.66370614359172" stroke-dashoffset="125.66370614359172"></circle>
  </svg>
</template>

<script>
export default {
  name: 'spinner',
  props: ['isLight'],
};
</script>

<style lang="stylus" scoped>
  @import '../../stylus/components/spinner.styl'
</style>
