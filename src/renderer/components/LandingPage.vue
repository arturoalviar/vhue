<template>
  <div>
    <div v-if="isLoading && isOnline">
      <splash-screen :isLoading="isLoading" :class="{'is-setup': needsSetup}"/>
    </div>
    <main v-if="hasBridge">
      <dashboard :displayType="displayType"/>
    </main>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Dashboard from '@/components/Dashboard/Dashboard';
  import SplashScreen from '@/components/SplashScreen/SplashScreen';

  export default {
    name: 'landing-page',
    components: { Dashboard, SplashScreen },
    props: ['displayType'],
    computed: {
      ...mapGetters({
        bridge: 'getBridge',
        username: 'getUsername',
        isOnline: 'getOnlineStatus',
        needsSetup: 'getNeedsSetup',
      }),
    },
    data() {
      return {
        hasBridge: false,
        hasError: false,
        errorMsg: '',
        isLoading: true,
      };
    },
    beforeMount() {
      this.startUp();
    },
    methods: {
      async checkBridge() {
        // call hue api for local bridges
        const bridges = await this.$http.get('https://discovery.meethue.com/');
        return bridges;
      },
      startUp() {
        if (this.needsSetup && !this.username) {
          // seems like the user hasn't setup a bridge so send them to the setup page
          setTimeout(() => {
            this.isLoading = false;
            this.$router.push('/setup');
          }, 2000);
        } else {
          if (this.isOnline) {
            this.checkBridge()
              .then((response) => {
                const { data } = response;
                const { id, internalipaddress } = this.bridge;
                // go through each bridge found and check if any match the one we have stored
                // check if the ip address checked on the bridge we have stored
                // if found, update store with new ip address
                data.forEach((item) => {
                  if (item.id === id && item.internalipaddress !== internalipaddress) {
                    this.$store.dispatch('setBridge', item);
                  }
                });
                setTimeout(() => {
                  this.isLoading = false;
                }, 2500);
              })
              .catch((error) => {
                this.errorMsg = error.message;
                this.hasError = true;
                return new Error(error);
              });
          } else {
            this.isLoading = false;
          }
          this.hasBridge = true;
        }
      },
    },
  };
</script>
