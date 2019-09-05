<template>
  <div class="vh-settings-shortcuts">
    <h3>Keyboard Shortcuts</h3>
    <div class="vh-item-form-block">
      <div class="vh-item-form-panel">
        <p class="vh-small" v-if="isMacOs">
          Make sure this app has <a href="#" @click.stop="allowAccess">accessibility access.</a>
        </p>
        <p>
          Toggle checked lights:
          <span class="vh-tag">{{bindings}}</span>
        </p>
        <ul>
          <li
            v-for="(group, id) in groups"
            :key="id"
           >
            <p>{{group.name}}</p>
            <ul>
              <li
                class="vh-checkbox"
                v-for="id in group.lights"
                :key="id"
               >
                <input
                  type="checkbox"
                  :id="id"
                  :value="id"
                  :checked="boundLights.includes(id)"
                  v-model="checkedLights"
                  @change="handleChange"
                  >
                <label :for="id" >
                  <checkbox/>
                  {{ lights[id].name }}
                </label>
              </li>
            </ul>
            </label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Checkbox from '@/components/Checkbox/Checkbox';
import { mapGetters } from 'vuex';

export default {
  name: 'settings-keybinds',
  components: { Checkbox },
  computed: {
    isMacOs() {
      return this.$electron.remote.process.platform === 'darwin';
    },
    bindings() {
      return this.isMacOs ? 'Cmd+Opt+Shift+P' : 'Ctrl+Alt+Shift+P';
    },
    ...mapGetters({
      groups: 'getGroups',
      lights: 'getLights',
      boundLights: 'getBoundLights',
    }),
  },
  data() {
    return {
      checkedLights: [],
    };
  },
  beforeMount() {
    this.checkedLights = this.boundLights;
  },
  methods: {
    allowAccess() {
      this.$electron.ipcRenderer.send('request-accessibility');
    },
    handleChange() {
      this.$store.dispatch('setBoundLights', this.checkedLights);
    },
  },
};
</script>

<style lang="stylus" scoped>
  @import '../../stylus/components/checkbox.styl'
  @import '../../stylus/components/tag.styl'
  .vh-small
    font-size: .85rem
    a
      color: var(--color-primary)
</style>
