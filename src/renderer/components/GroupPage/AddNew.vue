<template>
  <div class="vh-item-form-wrapper">
    <h2>Add New Room</h2>
    <form @submit.prevent="submitNewRoom">
      <div class="vh-item-form-block">
        <div class="vh-item-form-info">
          <label for="vh-new-room-name">Room Name</label>
          <input id="vh-new-room-name" type="text" v-model="room.name">
        </div>
      </div>
      <div class="vh-item-form-block">
       <div style="width: 100%">
         <div class="vh-item-form-info">
           <label for="vh-item-name">Select room type</label>
         </div>
         <div class="vh-select">
           <select v-model="room.class">
             <optgroup v-for="room in roomDropdown" :label="room.name">
               <option v-for="option in room.options" :value="option.value">
                 {{option.name}}
               </option>
             </optgroup>
           </select>
         </div>
        </div>
      </div>
      <div class="vh-item-form-block">
        <div class="vh-item-form-panel">
          <h4>Add lights to room</h4>
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
                v-model="room.lights"
                >
              <label :for="id" >
                <checkbox/>
                {{ light.name }}
              </label>
            </li>
          </ul>
        </div>
      </div>
      <button type="submit">Create new room</button>
    </form>
  </div>
</template>

<script>
import Checkbox from '@/components/Checkbox/Checkbox';
import { mapGetters } from 'vuex';
import { createRoom } from '@/modules/groups';
import createActionFlash from '@/helpers/flash';
import roomDropdown from '@/helpers/rooms';

export default {
  name: 'room-add-new',
  computed: {
    ...mapGetters({
      lights: 'getLights',
    }),
  },
  components: { Checkbox },
  data() {
    return {
      room: {
        name: 'My Room',
        lights: [],
        type: 'Room',
        class: 'Other',
      },
      roomDropdown,
    };
  },
  methods: {
    emitCreatedFlash(isSuccessful) {
      const payload = { type: 'Room', action: 'created' };
      const message = createActionFlash(isSuccessful, payload);
      this.$bus.$emit('flash-message', message);
    },
    submitNewRoom() {
      const created = createRoom(this.room);
      created
        .then((isSuccess) => {
          setTimeout(() => {
            this.emitCreatedFlash(isSuccess);
            this.$router.push('/groups');
          }, 500);
        });
    },
  },
};
</script>

<style lang="stylus" scoped>
  @import '../../stylus/components/checkbox.styl'
  @import '../../stylus/components/input.styl'
  @import '../../stylus/components/select.styl'
  input[type="text"]
    max-width: 100%
</style>
