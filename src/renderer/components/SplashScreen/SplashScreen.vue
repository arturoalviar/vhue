<template>
  <div class="huey-splash-screen" :class="{'has-loaded': !this.isLoading}">
    <spinner/>
    <h3>Talking to hue bridge</h3>
  </div>
</template>

<script>
  import Spinner from '@/components/Icon/Spinner.vue';
  export default {
    name: 'splash-page',
    components: { Spinner },
    props: ['isLoading'],
  };
</script>

<style scoped lang="stylus">
  @import '../../stylus/utils/*'
  .huey-splash-screen
    background: var(--color-bg)
    display: flex
    flex-flow: column
    justify-content: center
    align-items: center
    position: fixed
    top: 0
    left: nav.width
    right: 0
    bottom: 0
    width: calc(100% - nav.width)
    height: 100vh
    opacity: 1
    z-index: 1000
    &.is-setup
      left: 0
    &.has-loaded
      animation: fadeout 3s forwards 3s
    .vh-spinner-wrapper
      width: 64px
      height: @width
    h3
      margin-top: spacing.md
  @keyframes fadeout {
    to {
      opacity: 0;
      visibility: hidden;
    }
  }
</style>
