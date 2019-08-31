<template>
  <aside>
    <h1 class="app-logo">
      vhue
    </h1>
    <navigation/>
    <status/>
  </aside>
</template>

<script>

import Navigation from './Navigation';
import Status from './Status';

export default {
  name: 'app-header',
  components: { Navigation, Status },
};
</script>

<style lang="stylus" scoped>
  @import '../../stylus/components/header.styl'
</style>
