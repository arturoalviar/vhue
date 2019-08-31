<template>
  <div v-if="light">
    <div class="hue-light" :class="{'is-on': onStatus, 'is-unreachable': !isReachable}">
      <div class="hue-light-label-name">
        <router-link :to="{ name: 'light-page', params: { id } }">
          {{ light.name }}
        </router-link>
      </div>
      <div class="hue-light-status-bar">
        <div class="hue-light-online-status" :class="{'is-online': isReachable}">
          <light-icon :name="light.config.archetype"/>
          <span>{{ isReachable ? 'Online' : 'Unreachable'}}</span>
        </div>
        <div class="vh-light-toggle">
          <input
            type="checkbox"
            v-model="onStatus"
            :disabled="!isReachable"
            :id="'hue-light-' + id"
            :name="'hue-light-' + id"
            @click="toggleLight"
          />
          <label class="vh-light-toggle-rail" :for="'hue-light-' + id" aria-label="Toggle Light">
            <span class="vh-light-toggle-indicator"></span>
          </label>
        </div>
        <div class="hue-light-gradient" :style="{background: lightGradient}"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import LightIcon from '@/components/Icon/Icon';
  import { toggeLightStatus } from '@/modules/lights';
  import { getRgbValue, makeGradientStyle } from '@/helpers/light';

  export default {
    name: 'light',
    props: ['id', 'light'],
    components: { LightIcon },
    computed: {
      isReachable() {
        return this.light.state.reachable;
      },
      onStatus: {
        get() {
          return this.light.state.on;
        },
        set(newValue) {
          return newValue;
        },
      },
      isRgbLight() {
        const { state } = this.light;
        return Object.prototype.hasOwnProperty.call(state, 'xy');
      },
    },
    data() {
      return {
        rgb: null,
        lightGradient: 'linear-gradient(90deg, #FAB83E, transparent)',
      };
    },
    mounted() {
      this.setLightGradient();
    },
    methods: {
      setLightGradient() {
        this.rgb = this.determineLightColors(this.light);
        if (this.rgb) {
          this.lightGradient = makeGradientStyle(this.rgb);
        }
      },
      determineLightColors(light) {
        if (this.isReachable) {
          return getRgbValue(light, this.isRgbLight);
        }
        return false;
      },
      toggleLight() {
        toggeLightStatus(this.id);
      },
    },
  };
</script>

<style lang="stylus" scoped>
  @import '../../stylus/components/card.styl'
  @import '../../stylus/components/lightToggle.styl'
</style>
