<template>
  <div class="app-wrapper" :class="{'is-setup': needsSetup}">
    <flash-message/>
    <div v-if="!needsSetup">
      <app-header :class="{'is-hidden': needsSetup}"/>
    </div>
    <div id="wrapper">
      <router-view></router-view>
    </div>
    <div class="app-decorator">vhue</div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import FlashMessage from '@/components/Flash/Flash';
  import AppHeader from '@/components/Header/Header';
  import updateOnlineStatus from '@/helpers/online';
  import { handleBoundLights } from '@/modules/lights';
  export default {
    computed: {
      ...mapGetters({
        theme: 'getTheme',
        boundLights: 'getBoundLights',
        needsSetup: 'getNeedsSetup',
      }),
    },
    components: { AppHeader, FlashMessage },
    created() {
      const { body } = document;
      body.dataset.theme = this.theme;
      body.classList.add(`is-${this.theme}`);
      updateOnlineStatus();
    },
    name: 'vhue',
    mounted() {
      window.addEventListener('online', this.handleOnline.bind(this));
      window.addEventListener('offline', this.handleOffline.bind(this));
      this.$electron.ipcRenderer.on('toggleBoundLights', this.handleBoundLights.bind(this));
    },
    methods: {
      handleBoundLights() {
        handleBoundLights();
      },
      handleOffline() {
        updateOnlineStatus();
        this.$bus.$emit('flash-message', {
          text: 'No Internet connection.',
          status: 'error',
        });
      },
      handleOnline() {
        updateOnlineStatus();
        this.$bus.$emit('flash-message', {
          text: 'Device back online.',
          status: 'success',
        });
      },
    },
  };
</script>

<style lang="stylus">
@import './stylus/global.styl'
@import './stylus/components/button.styl'
@import './stylus/components/form.styl'
.app-wrapper
  position: relative
  .app-decorator
    color: var(--color-text)
    opacity: .05
    position: fixed
    bottom: 0
    right: 0
    font-size: 20vw
    font-weight: 900
    line-height: .5
    pointer-events: none
    z-index: -1
</style>
