import { Vue, Component } from "vue-property-decorator";

@Component
export default class ErrorHandling extends Vue {
  toastSuccess(message: string) {
    this.$buefy.toast.open({
      message: message,
      type: "is-success",
      position: "is-bottom"
    });
  }

  toastError(message: string = "Đã có lỗi xảy ra!") {
    this.$buefy.toast.open({
      message: message,
      type: "is-danger",
      position: "is-bottom"
    });
  }
}
