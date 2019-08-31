<template>
  <div class="vh-group">
    <h2>
      <router-link :to="{ name: 'group-page', params: { id } }">
        {{ group.name }}
      </router-link>
    </h2>
    <ul class="vh-group-lights">
      <li
        v-for="id in group.lights"
        :key="id"
      >
        <light :id='id' :light="lights[id]"/>
      </li>
    </ul>
  </div>
</template>

<script>
  import Light from '@/components/Light/Light';

  export default {
    name: 'hue-group',
    components: { Light },
    props: ['id', 'group', 'lights'],
  };
</script>

<style lang="stylus" scoped>
  @import '../../stylus/layout/lights.styl'
</style>
