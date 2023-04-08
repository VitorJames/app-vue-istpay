<template>
  <v-snackbar v-model="snackbar" :timeout="timeout" :color="message.color">
    {{ message.text }}

    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      default: {
        text: "",
        color: "warning"
      }
    },
  },
  data: () => ({
    snackbar: false,
    timeout: 3000,
  }),
  watch: {
    message(val) {
      if (val.text != "") {
        switch (val.color) {
          case "success":
            val.color = "green";
            break;
          case "warning":
            val.color = "orange";
            break;
          case "error":
            val.color = "red";
            break;

          default:
            break;
        }

        this.snackbar = true;
      }
      return val;
    },
  },
  methods: {},
};
</script>