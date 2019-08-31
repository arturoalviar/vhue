<template>
  <nav id="vhue-nav">
    <ul>
      <router-link tag="li" :to="{name: 'groups-page'}" active-class="is-current-link">
        <Icon name="other" filename="rooms"/>
        <a name="groups">Rooms</a>
      </router-link>
      <router-link tag="li" :to="{name: 'lights-page'}" active-class="is-current-link">
        <Icon name="sultanbulb" filename="lights"/>
        <a name="lights">Lights</a>
      </router-link>
      <router-link tag="li" :to="{name: 'settings-page'}" active-class="is-current-link">
        <Icon name="settings" filename="icons"/>
        <a>Settings</a>
      </router-link>
    </ul>
  </nav>
</template>

<script>
import Icon from '@/components/Icon/Icon';

export default {
  name: 'navigation',
  components: { Icon },
};
</script>

<style lang="stylus" scoped>
  @import '../../stylus/components/navigation.styl'
</style>
