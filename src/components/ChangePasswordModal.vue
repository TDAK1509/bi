<template>
  <b-modal
    class="change-password-modal"
    :active="show"
    @update:active="onUpdateActive"
    has-modal-card
    trap-focus
  >
    <form>
      <div class="modal-card" style="width: 350px">
        <header class="modal-card-head">
          <p class="modal-card-title">Đổi Password</p>
        </header>
        <section class="modal-card-body">
          <b-field label="Password cũ">
            <b-input v-model="oldPassword" type="password" password-reveal />
          </b-field>

          <b-field label="Password mới">
            <b-input v-model="newPassword" type="password" password-reveal />
          </b-field>

          <b-field label="Nhập lại password mới">
            <b-input
              v-model="confirmPassword"
              type="password"
              password-reveal
            />
          </b-field>

          <p class="has-text-danger">{{ errorMessage }}</p>
        </section>
        <footer class="modal-card-foot change-password-modal__footer">
          <b-button
            :loading="isChangingPassword"
            class="button is-dark change-password-modal__footer-button"
            @click="changePassword"
          >
            Đổi
          </b-button>
        </footer>
      </div>
    </form>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Emit, Model } from "vue-property-decorator";
import { ErrorMessage } from "../models/helpers";

@Component
export default class ChangePasswordModal extends Vue {
  oldPassword = "";
  newPassword = "";
  confirmPassword = "";
  errorMessage = "";
  isChangingPassword = false;

  @Model("input", { type: Boolean, required: true })
  show!: boolean;

  @Emit("input")
  onUpdateActive(active: boolean) {}

  async changePassword() {
    this.isChangingPassword = true;

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = "Password không khớp nhau!";
      return;
    }

    if (this.oldPassword === this.newPassword) {
      this.errorMessage = "Password mới phải khác password cũ!";
      return;
    }

    const response: ErrorMessage = await this.$store.dispatch(
      "changePassword",
      {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      }
    );

    if (!response.success) {
      this.errorMessage = response.message;
    } else {
      this.errorMessage = "";
      this.onUpdateActive(false); // Close modal
      this.$buefy.toast.open({
        message: response.message,
        type: "is-success"
      });
    }

    this.isChangingPassword = false;
  }
}
</script>

<style lang="scss" scoped>
.change-password-modal__footer {
  text-align: center;
}
.change-password-modal__footer-button {
  margin: auto;
}
</style>
