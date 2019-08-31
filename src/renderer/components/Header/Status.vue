<template>
  <div class="online-status" :class="currentClass">
    <span class="status-indicator"></span>
    <span class="status">{{ status }}</span>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    computed: {
      ...mapGetters({
        isOnline: 'getOnlineStatus',
      }),
      currentClass() {
        return this.isOnline ? 'is-online' : 'is-offline';
      },
      status() {
        return this.isOnline ? 'Online' : 'Offline';
      },
    },
    name: 'online-status',
  };
</script>

<style lang="stylus" scoped>
  @import '../../stylus/components/status'
</style>
