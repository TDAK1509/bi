<template>
  <div class="logi">
    <form
      class="login__form"
      @keydown.enter.prevent="login"
      @submit.prevent="login"
    >
      <b-field label="Email">
        <b-input v-model="email" type="email" />
      </b-field>

      <b-field label="Password">
        <b-input v-model="password" type="password" password-reveal />
      </b-field>

      <p class="has-text-danger">{{ errorMessage }}</p>

      <b-button
        class="login__form-button"
        type="is-dark"
        :loading="loading"
        native-type="submit"
        >ĐĂNG NHẬP</b-button
      >
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Login extends Vue {
  email = "";
  password = "";
  loading = false;
  errorMessage = "";

  async login() {
    this.loading = true;

    const loggedIn = await this.$store.dispatch("auth/login", {
      username: this.email,
      password: this.password
    });

    if (loggedIn === true) {
      this.$router.push({ name: "transaction" });
    }

    this.errorMessage = "Sai email/password";
    this.loading = false;
  }
}
</script>

<style lang="scss" scoped>
.login {
  text-align: center;
}
.login__form {
  width: 500px;
  height: 500px;
  margin: auto;
  margin-top: 80px;
}
.login__form-button {
  margin-top: 7px;
}
</style>
