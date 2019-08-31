<template>
  <div class="vh-item-form-wrapper">
    <div class="light-info" :class="{'is-unreachable': !isReachable}">
      <div class="vh-item-form-title">
        <light-icon :name="light.config.archetype"/>
        <h2>{{heading}}</h2>
        <div class="vh-light-toggle">
          <input
            type="checkbox"
            v-model="onStatus"
            :disabled="!isReachable || !isOnline"
            :id="'hue-light-' + id"
            :name="'hue-light-' + id"
            @change="toggleLight"
          />
          <label class="vh-light-toggle-rail" :for="'hue-light-' + id" aria-label="Toggle Light">
            <span class="vh-light-toggle-indicator"></span>
          </label>
        </div>
      </div>
      <div class="vh-item-form-block">
        <div class="vh-item-form-info">
          <label for="light-name">Edit Light Name</label>
          <input
            id="light-name"
            type="text"
            v-model="models.name"
          >
        </div>
        <div class="vh-item-form-control">
          <button @click="updateLightName">Update Name</button>
        </div>
      </div>
      <div class="vh-item-form-block">
        <div class="vh-item-form-info">
          <label for="light-brightness">Adjust Brightness {{ briPercentage }}%</label>
          <input
            id="light-brightness"
            type="range"
            min="1"
            max="254"
            step="1"
            :disabled="!onStatus || !isOnline"
            v-model="brightness"
            @change="updateBrightness"
           >
        </div>
      </div>
      <div class="vh-item-form-panel">
        <h4>Light Details</h4>
        <p>Type: {{light.productname}}</p>
        <p>Model ID: {{light.modelid}}</p>
        <p>SW: {{light.swversion}}</p>
      </div>
      <button
        class="is-danger"
        @click="deleteLight"
      >
        Delete Light
      </button>
    </div>
  </div>
</template>

<script>
import LightIcon from '@/components/Icon/Icon';
import { mapGetters } from 'vuex';
import { deleteLight, updateLightName, setLightState, toggeLightStatus } from '@/modules/lights';
import createActionFlash from '@/helpers/flash';
import { determineBrightnessPercentage } from '@/helpers/light';

export default {
  name: 'light-page',
  computed: {
    briPercentage: {
      get() {
        return determineBrightnessPercentage(this.brightness);
      },
      set(newValue) {
        return determineBrightnessPercentage(newValue);
      },
    },
    light() {
      return this.$store.getters.getLightById(this.id);
    },
    heading() {
      return this.light.name;
    },
    ...mapGetters({
      lights: 'getLights',
      isOnline: 'getOnlineStatus',
    }),
  },
  components: { LightIcon },
  data() {
    return {
      id: this.$route.params.id,
      models: {
        name: '',
      },
      brightness: 70,
      onStatus: false,
      isReachable: true,
      refresh: null,
    };
  },
  beforeMount() {
    this.refreshLight();
    this.models.name = this.light.name;
  },
  mounted() {
    this.refresh = setInterval(() => {
      this.getData();
    }, 3000);
  },
  beforeDestroy() {
    clearInterval(this.refresh);
  },
  methods: {
    emitUpdatedFlash(isSuccessful, error = null) {
      const payload = {
        type: 'Light',
        name: this.models.name,
        action: 'updated',
        error,
      };
      const message = createActionFlash(isSuccessful, payload);
      this.$bus.$emit('flash-message', message);
    },
    emitDeletedFlash(isSuccessful, error = null) {
      const payload = { type: 'Light', action: 'deleted', error };
      const message = createActionFlash(isSuccessful, payload);
      this.$bus.$emit('flash-message', message);
    },
    updateStore(data) {
      const newState = { ...this.light, ...data };
      this.$store.dispatch('updateLight', {
        id: this.id,
        newState,
      });
    },
    updateBrightness() {
      const bri = parseInt(this.brightness, 10);
      const data = { bri };
      const updated = setLightState(this.id, data);
      updated.then(() => {
        this.briPercentage = determineBrightnessPercentage(bri);
        this.updateStore({ state: { ...this.light.state, ...data } });
      });
    },
    toggleLight() {
      toggeLightStatus(this.id);
    },
    updateLightName() {
      const updated = updateLightName(this.id, this.models.name);
      updated
        .then(this.emitUpdatedFlash.bind(this))
        .then(() => {
          this.updateStore({ name: this.models.name });
        })
        .catch((error) => {
          this.emitUpdatedFlash(false, error.message);
        });
    },
    deleteLight() {
      const deleted = deleteLight(this.id);
      deleted
        .then((response) => {
          const { data } = response;
          const isSuccess = Object.prototype.hasOwnProperty.call(data[0], 'success');
          if (isSuccess) {
            this.$store.dispatch('deleteLight', this.id);
            setTimeout(() => {
              this.emitDeletedFlash(isSuccess);
              this.$router.push('/lights');
            }, 500);
          } else {
            this.emitDeletedFlash(isSuccess);
          }
        })
        .catch((error) => {
          this.emitDeletedFlash(false, error.message);
        });
    },
    getData() {
      if (this.isOnline) {
        this.$store.dispatch('setLight', this.id);
        this.refreshLight();
      }
    },
    refreshLight() {
      const { on, reachable, bri } = this.light.state;

      this.brightness = bri;
      this.onStatus = on;
      this.isReachable = reachable;
    },
  },
};
</script>

<style lang="stylus" scoped>
  @import '../../stylus/components/input.styl'
  @import '../../stylus/components/range.styl'
  @import '../../stylus/components/lightToggle.styl'
  .light-info
    &.is-unreachable
      .vh-light-toggle label
        cursor: not-allowed
  .vh-item-form-title
    position: relative
    padding-right: 32px
  .vh-light-toggle
    position: absolute
    top: 50%
    right: 0
    transform: translateY(-50%)
</style>
