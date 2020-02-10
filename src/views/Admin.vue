<template>
  <div class="admin">
    <b-button icon-left="plus" type="is-info" @click="showAddUserModal = true"
      >Thêm Người Dùng</b-button
    >
    <b-modal
      :active.sync="showAddUserModal"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <form>
        <div class="modal-card" style="width: auto">
          <section class="modal-card-body">
            <b-field label="Email">
              <b-input
                type="email"
                v-model="email"
                placeholder="Your email"
                required
              >
              </b-input>
            </b-field>

            <b-field
              label="Password"
              :type="{ 'is-danger': errorMessage }"
              :message="errorMessage"
            >
              <b-input
                type="password"
                v-model="password"
                password-reveal
                placeholder="Your password"
                required
              >
              </b-input>
            </b-field>

            <div class="admin__button-container">
              <b-button
                class="admin__button"
                icon-left="plus"
                type="is-dark"
                :disabled="!email || !password || !isEmailValid"
                @click="addUser"
                >Thêm</b-button
              >
            </div>
          </section>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Admin extends Vue {
  showAddUserModal = false;
  email = "";
  password = "";

  get isEmailValid(): boolean {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(this.email);
  }

  get errorMessage(): string {
    return this.isEmailValid || !this.email ? "" : "Định dạng email không đúng";
  }

  addUser() {}
}
</script>

<style lang="scss" scoped>
.admin__button-container {
  text-align: center;
}

.admin__button {
  margin-top: 10px;
}
</style>
