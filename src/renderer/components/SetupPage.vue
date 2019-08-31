<template>
  <div class="vh-item-form-wrapper">
    <div>
      <h1>Setup</h1>
      <div v-if="!isOnline">
        <p style="color: var(--color-danger)">Seems like you are offline. Please connect to the Internet to continue the setup process.</p>
      </div>
    </div>
    <form @submit.prevent="completeSetup">
      <div class="vh-item-form-panel" v-if="step === 1">
        <div class="vh-item-form-block has-loader">
          <p>Get started by powering your Hue Bridge and hooking it up to your WiFi router via an ethernet cable.</p>
          <p>Please make sure this device is on the same network in order to find your
          Hue Bridge automatically.</p>
          <div v-if="!searchError && hasDiscoveredBridge">
            <button
              :disabled="!isOnline"
              @click.stop="configureIpaddress"
            >
              Continue Setup
            </button>
          </div>
          <button
            @click="findBridges"
            :disabled="!isOnline || lookingForBridge"
            v-show="!hasDiscoveredBridge"
          >
          <div class="button-loading" v-if="lookingForBridge">
            <spinner isLight="true"/>
            <p>Searching...</p>
          </div>
          <p v-else>Search for Bridge</p>
          </button>
        </div>
      </div>
      <div class="vh-item-form-panel" v-if="step === 2">
        <h3>Name your bridge</h3>
        <p>You can change the name later</p>
        <div class="vh-item-form-block">
          <div class="vh-item-form-info">
            <label for="bridge-name">Bridge Name</label>
            <input type="text" v-model="bridgeName">
          </div>
          <div class="vh-item-form-control">
            <button @click.stop="setBridgeName" :disabled="!isOnline">Continue Setup</button>
          </div>
        </div>
      </div>
      <div class="vh-item-form-panel" v-if="step === 3">
        <h2>Almost there!</h2>
        <p>
          Please press the link button on your Hue bridge then click on the "Connect to Bridge" button.
        </p>
        <p>
          If more that 30 seconds elapse, please press the button again before proceeding.
        </p>
        <div class="vh-item-form-block vh-error" v-if="linkButtonError">
          <p>Link button was not detected. Please press the link button and try again.</p>
        </div>
        <button
          :disabled="isSettingUsername || !isOnline"
          @click.stop.prevent="configureUsername"
        >
        <div class="button-loading" v-if="isSettingUsername">
          <spinner isLight="true"/>
          <p>Connecting...</p>
        </div>
        <p v-else>Connect to Bridge</p>
        </button>
      </div>
      <div class="vh-item-form-panel" v-if="step === 4">
        <h3>You are all connected</h3>
        <button type="submit">Go to dashboard</button>
      </div>
    </form>
  </div>
</template>

<script>
  import Spinner from '@/components/Icon/Spinner.vue';
  import { mapGetters } from 'vuex';
  import { configureUsername, emitBridgeFlash, findBridges } from '@/modules/connect';

  export default {
    name: 'setup-page',
    components: { Spinner },
    data() {
      return {
        bridges: [],
        bridgeName: 'Vhue Bridge',
        discoveredBridge: {},
        lookingForBridge: false,
        hasDiscoveredBridge: false,
        hasSearched: false,
        isSettingUsername: false,
        linkButtonError: false,
        searchError: false,
        step: 1,
      };
    },
    computed: {
      ...mapGetters({
        bridge: 'getBridge',
        isOnline: 'getOnlineStatus',
      }),
    },
    methods: {
      emitBridgeFlash() {
        const message = emitBridgeFlash(this.searchError);
        this.$bus.$emit('flash-message', message);
      },
      findBridges() {
        this.lookingForBridge = true;
        const discovered = findBridges();
        discovered
          .then((response) => {
            this.hasSearched = true;
            const { data } = response;
            if (response.status === 200 && data.length) {
              [this.discoveredBridge] = data;
              setTimeout(() => {
                this.hasDiscoveredBridge = true;
                this.lookingForBridge = false;
                this.emitBridgeFlash();
              }, 1500);
            } else {
              this.searchError = true;
              this.emitBridgeFlash();
            }
          })
          .catch(() => {
            this.searchError = true;
            this.emitBridgeFlash();
          });
      },
      configureIpaddress() {
        this.$store.dispatch('setBridge', this.discoveredBridge);
        this.step += 1;
      },
      setBridgeName() {
        this.$store.dispatch('setBridgeName', this.bridgeName);
        this.step += 1;
      },
      configureUsername() {
        this.linkButtonError = false;
        this.isSettingUsername = true;
        const posted = configureUsername({
          name: this.bridgeName,
          ip: this.bridge.internalipaddress,
        });
        posted
          .then((response) => {
            const { status, data } = response;
            const isSuccess = Object.prototype.hasOwnProperty.call(data[0], 'success');

            if (status && isSuccess) {
              const { username } = data[0].success;
              this.$store.dispatch('setUsername', username);
              setTimeout(() => {
                this.step += 1;
              }, 2000);
            } else {
              setTimeout(() => {
                this.isSettingUsername = false;
                this.linkButtonError = true;
              }, 1000);
            }
          });
      },
      completeSetup() {
        this.$store.dispatch('setNeedsSetup', false);
        this.$router.push('/groups');
      },
    },
  };
</script>

<style scoped lang="stylus">
  @import '../stylus/components/input.styl'
  .vh-item-form-block.has-loader
    flex-flow: column
    align-items: flex-start
    justify-content: flex-start
  .button-loading
    display: flex
    align-items: center
    justify-content: center
    width: 100%
    svg
      width: 1rem
      height: 1rem
    p
      padding-left: 10px
  .vh-error
    color: var(--color-danger)
</style>
