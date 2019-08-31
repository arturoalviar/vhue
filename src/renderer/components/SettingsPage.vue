<template>
  <div class="vh-settings-container">
    <h1>Settings</h1>
    <h3>General</h3>
    <div class="vh-item-form-block">
      <div class="vh-item-form-info">
        <label for="vh-bridge-name-input">Bridge Name</label>
      </div>
      <div class="vh-item-form-control">
        <input
          id="vh-bridge-name-input"
          type="text"
          v-model="updatedBridgeName"
          @blur="updateBridgeName"
         >
      </div>
    </div>
    <div class="vh-item-form-block">
      <div class="vh-item-form-info">
        <label for="vh-bridge-username-input">Username</label>
      </div>
      <div class="vh-item-form-control">
        <input
          id="vh-bridge-username-input"
          type="text"
          readonly
          v-model="username"
         >
      </div>
    </div>

    <div class="vh-item-form-block">
      <div class="vh-item-form-info">
        <label>App Theme</label>
      </div>
      <div class="vh-item-form-control">
        <div class="vh-radio-group">
          <div class="vh-radio">
            <input
              id="vh-theme-light-radio"
              type="radio"
              v-model="updatedAppTheme"
              @change="updateAppTheme"
              value="light"
            >
            <label for="vh-theme-light-radio">Light</label>
          </div>
          <div class="vh-radio">
            <input
              id="vh-theme-dark-radio"
              type="radio"
              v-model="updatedAppTheme"
              @change="updateAppTheme"
              value="dark"
            >
            <label for="vh-theme-dark-radio">Dark</label>
          </div>
        </div>
      </div>
    </div>
    <div class="vh-item-form-block">
      <div class="vh-item-form-info">
        <label for="vh-default-view">Default view</label>
      </div>
      <div class="vh-item-form-control">
        <div class="vh-select">
          <select
            v-model="updatedDefaultView"
            @change="updateDefaultView"
          >
            <option value="groups">Groups</option>
            <option value="lights">Lights</option>
          </select>
        </div>
      </div>
    </div>
    <keybinds/>
    <div class="vh-settings-dangerzone">
      <h3>Danger Zone</h3>
      <div class="vh-item-form-block">
        <div class="vh-item-form-info">
          <label for="vh-reset-app">Delete all app data</label>
        </div>
        <div class="vh-item-form-control">
          <button class="is-danger" @click="clearAllData">Clear all data</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Keybinds from '@/components/Settings/Keybinds';
import { mapGetters } from 'vuex';

export default {
  name: 'app-settings',
  components: { Keybinds },
  computed: {
    ...mapGetters({
      bridgeName: 'getBridgeName',
      appTheme: 'getTheme',
      defaultView: 'getDefaultView',
      username: 'getUsername',
    }),
  },
  created() {
    this.setLocalState();
  },
  data() {
    return {
      theme: 'light',
      updatedBridgeName: '',
      updatedDefaultView: '',
      updatedAppTheme: '',
    };
  },
  methods: {
    clearAllData() {
      this.$electron.ipcRenderer.send('clear-data');
    },
    updateBridgeName() {
      if (this.updatedBridgeName && this.updatedBridgeName !== this.bridgeName) {
        this.$store.dispatch('setBridgeName', this.updatedBridgeName);
      }
    },
    updateDefaultView() {
      this.$store.dispatch('setDefaultView', this.updatedDefaultView);
    },
    updateAppTheme() {
      const { body } = document;
      body.classList.remove('is-light', 'is-dark');
      body.classList.add(`is-${this.updatedAppTheme}`);
      body.dataset.theme = this.updatedAppTheme;
      this.$store.dispatch('setTheme', this.updatedAppTheme);
    },
    setLocalState() {
      this.updatedBridgeName = this.bridgeName;
      this.updatedDefaultView = this.defaultView;
      this.updatedAppTheme = this.appTheme;
    },
  },
};
</script>

<style lang="stylus" scoped>
  @import '../stylus/components/input.styl'
  @import '../stylus/components/radio.styl'
  @import '../stylus/components/select.styl'
  .vh-settings-container
    max-width: 600px
  .vh-item-form-block
    margin-bottom: 30px
    input
      min-width: 320px
</style>
