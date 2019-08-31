<template>
  <div class="vh-item-form-wrapper">
    <div class="vh-item-form-title">
      <light-icon :name="groupClassName" filename="rooms"/>
      <h2>{{heading}}</h2>
    </div>
    <div class="vh-item-form-block">
      <div class="vh-item-form-info">
        <label for="vh-item-name">Edit Room Name</label>
        <input
          id="vh-item-name"
          type="text"
          v-model="models.name"
        >
      </div>
      <div class="vh-item-form-control">
        <button @click="updateGroupName">Update Name</button>
      </div>
    </div>
    <div class="vh-item-form-block">
      <div class="vh-item-form-info">
        <label for="vh-item-name">Change room type</label>
      </div>
      <div class="vh-item-form-control">
        <div class="vh-select" :class="{'is-disabled': !isOnline }">
          <select
            v-model="models.class"
            @change="updateGroupClass"
            :disabled="!isOnline"
          >
            <optgroup v-for="room in roomDropdown" :label="room.name">
              <option v-for="option in room.options" :value="option.value">
                {{option.name}}
              </option>
            </optgroup>
          </select>
        </div>
      </div>
    </div>
    <div class="vh-item-form-panel">
      <h4>Edit lights in room</h4>
      <ul>
        <li
          class="vh-checkbox"
          v-for="(light, id) in lights"
          :key="id"
         >
          <input
            type="checkbox"
            :id="id"
            :value="id"
            v-model="models.lights"
            >
          <label :for="id" >
            <checkbox/>
            {{ light.name }}
          </label>
        </li>
      </ul>
      <div>
        <button @click="updateGroupLights">Update Room Lights</button>
      </div>
    </div>
    <div>
      <button
        class="is-danger"
        @click="deleteRoom"
      >
        Delete Room
      </button>
    </div>
  </div>
</template>

<script>
import Checkbox from '@/components/Checkbox/Checkbox';
import LightIcon from '@/components/Icon/Icon';
import { mapGetters } from 'vuex';
import _kebabcase from 'lodash.kebabcase';
import { updateGroup, deleteRoom } from '@/modules/groups';
import createActionFlash from '@/helpers/flash';
import roomDropdown from '@/helpers/rooms';

export default {
  name: 'group-page',
  computed: {
    group() {
      return this.$store.getters.getGroupById(this.id);
    },
    groupClassName() {
      return _kebabcase(this.models.class);
    },
    heading() {
      return this.group.name;
    },
    ...mapGetters({
      groups: 'getGroups',
      lights: 'getLights',
      isOnline: 'getOnlineStatus',
    }),
  },
  components: { Checkbox, LightIcon },
  data() {
    return {
      id: this.$route.params.id,
      models: {
        name: '',
        lights: [],
        class: 'Other',
      },
      roomDropdown,
      refresh: null,
    };
  },
  beforeMount() {
    this.refreshRoom();
    this.models.name = this.group.name;
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
    emitUpdatedGroupFlash(isSuccessful, error = null) {
      const payload = { type: 'Room', action: 'updated', error };
      const message = createActionFlash(isSuccessful, payload);
      this.$bus.$emit('flash-message', message);
    },
    emitUpdatedNameFlash(isSuccessful, error = null) {
      const payload = {
        type: 'Room',
        name: this.models.name,
        action: 'updated',
        error,
      };
      const message = createActionFlash(isSuccessful, payload);
      this.$bus.$emit('flash-message', message);
    },
    emitDeletedFlash(isSuccessful, error = null) {
      const payload = { type: 'Room', action: 'deleted', error };
      const message = createActionFlash(isSuccessful, payload);
      this.$bus.$emit('flash-message', message);
    },
    updateStore(data) {
      const newState = { ...this.group, ...data };
      this.$store.dispatch('updateGroup', {
        id: this.id,
        newState,
      });
    },
    updateGroupName() {
      const data = { name: this.models.name };
      const updated = updateGroup(this.id, data);
      updated
        .then(this.emitUpdatedNameFlash.bind(this))
        .then(() => {
          this.updateStore(data);
        })
        .catch((error) => {
          this.emitUpdatedNameFlash(false, error.message);
        });
    },
    updateGroupClass() {
      const data = { class: this.models.class };
      const updated = updateGroup(this.id, data);
      updated
        .then(() => {
          this.updateStore(data);
        });
    },
    updateGroupLights() {
      const data = { lights: this.models.lights };
      const updated = updateGroup(this.id, data);
      updated
        .then(this.emitUpdatedGroupFlash.bind(this))
        .then(() => {
          this.updateStore(data);
        })
        .catch((error) => {
          this.emitUpdatedGroupFlash(false, error.message);
        });
    },
    deleteRoom() {
      const deleted = deleteRoom(this.id);
      deleted
        .then((response) => {
          const { data } = response;
          const isSuccess = Object.prototype.hasOwnProperty.call(data[0], 'success');
          if (isSuccess) {
            this.$store.dispatch('deleteGroup', this.id);
            setTimeout(() => {
              this.emitDeletedFlash(isSuccess);
              this.$router.push('/groups');
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
        this.$store.dispatch('setGroup', this.id);
        this.refreshRoom();
      }
    },
    refreshRoom() {
      this.models.lights = this.group.lights;
      this.models.class = this.group.class;
    },
  },
};
</script>

<style lang="stylus" scoped>
  @import '../../stylus/components/checkbox.styl'
  @import '../../stylus/components/input.styl'
  @import '../../stylus/components/select.styl'
</style>
