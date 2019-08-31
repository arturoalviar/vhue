<template>
  <div class="flash-message-wrapper"
    :class="['is-' + message.status, {
      'is-visible': isVisible,
    }]">
    <div class="flash-message">
      {{ message.text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'flash-message',
  computed: {
    appWrapper() {
      return document.getElementById('wrapper');
    },
  },
  data() {
    return {
      isVisible: false,
      message: {
        text: '',
        delay: 3000,
        status: 'success',
      },
    };
  },
  mounted() {
    let timeout;
    this.$bus.$on('flash-message', (message) => {
      clearTimeout(timeout);
      const newMessage = message;

      this.message = Object.assign(this.message, newMessage);
      this.showFlash();

      timeout = setTimeout(() => {
        this.hideFlash();
      }, 3000);
    });
  },
  methods: {
    hideFlash() {
      this.appWrapper.classList.remove('has-flash-message');
      this.isVisible = false;
    },
    showFlash() {
      this.appWrapper.classList.add('has-flash-message');
      this.isVisible = true;
    },
  },
};
</script>

<style lang="stylus" scoped>
  @import '../../stylus/components/flash.styl'
</style>
