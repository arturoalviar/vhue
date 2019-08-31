<template>
  <div class="vh-container-small">
    <h1>Add a new light</h1>
    <div class="vh-item-form-block">
      <div class="vh-item-form-info">
        <p>
          To find new lights, make sure the lights are powered on and then hit the <strong>Search for Lights</strong> button down below.
        </p>
        <button :disabled="isSeaching" @click="searchForLights">{{
          isSeaching ? 'Searching...' : 'Search for lights'
        }}</button>
      </div>
    </div>
    <div class="vh-item-form-panel" v-if="hasSearched">
      <div class="vh-align-center" v-if="isSeaching">
        <div class="vh-loading">
          <spinner/>
          <p>Searching for new lights...</p>
        </div>
      </div>
      <div v-if="discoveredLights.length">
        <h4>Discovered Lights</h4>
        <ul class="vh-discovered-lights">
          <li v-for="light in discoveredLights">
            {{light.details.name}}
          </li>
        </ul>
      </div>
      <div class="vh-align-center" v-if="noLightsFound">
        <h4>No new lights found 😞</h4>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Spinner from '@/components/Icon/Spinner';
import { getNewLights, searchForLights } from '@/modules/lights';

export default {
  name: 'light-add-new',
  computed: {
    ...mapGetters({
      bridge: 'getBridge',
      username: 'getUsername',
    }),
  },
  components: { Spinner },
  data() {
    return {
      hasSearched: false,
      isSeaching: false,
      noLightsFound: false,
      searchInterval: null,
      discoveredLights: [],
    };
  },
  beforeDestroy() {
    clearInterval(this.searchInterval);
  },
  methods: {
    getNewLights() {
      const newLights = getNewLights();
      newLights
        .then((res) => {
          const { data } = res;
          const isActive = data.lastscan === 'active';

          if (isActive) {
            const filtered = Object.keys(data).filter(key => key !== 'lastscan');

            if (filtered.length && filtered.length !== this.discoveredLights.length) {
              this.discoveredLights = filtered.map(key => ({ id: key, details: data[key] }));
            }
          } else {
            this.isSeaching = false;
            this.noLightsFound = this.discoveredLights.length < 1;

            clearInterval(this.searchInterval);
          }
        });
    },
    searchForLights() {
      const search = searchForLights();
      search
        .then(() => {
          this.hasSearched = true;
          this.isSeaching = true;
          this.searchInterval = setInterval(this.getNewLights.bind(this), 1000);
        });
    },
  },
};
</script>

<style lang="stylus" scoped>
  @import '../../stylus/utils/vars.styl'
  @import '../../stylus/components/input.styl'
  .vh-item-form-info input
    max-width: 100%
  .vh-container-small
    max-width: 600px
    width: 100%
  .vh-discovered-lights
    padding: 0
    margin: 0
  .vh-align-center
    text-align: center
    padding: spacing.md 0
    h4, p
      margin: 0
</style>
