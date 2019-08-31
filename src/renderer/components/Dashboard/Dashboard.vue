<template>
  <div id="dashboard">
    <div v-if="isOnline">
      <div v-if="displayType === 'groups'">
        <div class="topbar">
          <h1>Rooms</h1>
          <router-link :to="{ name: 'room-add-new' }" class="button">Add new room</router-link>
        </div>
        <ul class="vh-groups" v-if="groups">
          <li
            v-for="(group, id) in groups"
            :key="id"
          >
            <group :id="id" :group="group" :lights="lights"/>
          </li>
        </ul>
      </div>
      <div v-else>
        <div class="topbar">
          <h1>Lights</h1>
          <router-link :to="{ name: 'light-add-new' }" class="button">Add new lights</router-link>
        </div>
        <ul class="vh-group-lights" v-if="lights">
          <li
            v-for="(light, id) in lights"
            :key="light.uniqueid"
          >
            <light :id='id' :light="light"></light>
          </li>
        </ul>
      </div>
    </div>
    <div class="offline-screen" v-else>
      <icon name="connection-error" filename="icons"/>
      <h3>Your device is currently offline</h3>
    </div>
  </div>
</template>

<script>

  import { mapGetters } from 'vuex';
  import Group from '@/components/Group/Group.vue';
  import Light from '@/components/Light/Light.vue';
  import Icon from '@/components/Icon/Icon.vue';

  export default {
    name: 'dashboard',
    components: {
      Group, Light, Icon,
    },
    props: ['displayType'],
    computed: {
      ...mapGetters({
        lights: 'getLights',
        groups: 'getGroups',
        isOnline: 'getOnlineStatus',
      }),
    },
    methods: {
      getData() {
        if (this.isOnline) {
          this.$store.dispatch('setGroups');
          this.$store.dispatch('setLights');
        }
      },
    },
    beforeMount() {
      this.getData();
    },
    mounted() {
      this.refresh = setInterval(() => {
        this.getData();
      }, 5000);
    },
    beforeDestroy() {
      clearInterval(this.refresh);
    },
  };
</script>


<style lang="stylus" scoped>
  @import '../../stylus/layout/lights.styl'
  .topbar
    display: flex
    align-items: center
    justify-content: space-between
    position: relative
    width: 100%
    padding-bottom: 1rem
    margin-bottom: @padding-bottom
    h1
      margin: 0
  .button
    justify-content: center
  .vh-groups
    li:not(:last-of-type)
      margin-bottom: 30px
  .offline-screen
    background: var(--color-bg)
    position: absolute
    top: 0
    left: 0
    right: 0
    height: 100vh
    display: flex
    flex-flow: column
    justify-content: center
    align-items: center
    z-index: 100
    svg
      fill: var(--color-danger)
      max-width: 128px
      width: 100%
</style>
