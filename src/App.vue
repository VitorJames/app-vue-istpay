<template>
  <v-app>
    <v-app-bar app absolute color="blue-grey darken-2" dark>
      <div class="d-flex align-center">
        <h3>VAGAS.COM</h3>
      </div>
      <v-spacer></v-spacer>
      <v-icon :disabled="mode">mdi-white-balance-sunny</v-icon>
      <v-switch
        v-model="mode"
        class="mt-5 ml-3 mr-1"
      ></v-switch>
      <v-icon :disabled="!mode">mdi-weather-night</v-icon>
      <template v-slot:extension>
        <v-tabs grow>
          <v-tab to="/">Vagas</v-tab>
          <v-tab to="/candidatos">Candidatos</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    mode: false
  }),
  watch:{
    mode(val){
      localStorage.setItem("mars_explorations_theme", val);
      this.$vuetify.theme.dark = val;
    }
  },
  created(){
    var local_mode = localStorage.getItem("mars_explorations_theme");
    
    this.mode = local_mode !== null ? this.$vuetify.theme.dark = (local_mode === 'true') : this.$vuetify.theme.dark = false;

    if (local_mode === null) {
      localStorage.setItem("mars_explorations_theme", false);
      this.$vuetify.theme.dark = false;
    }
  }
};
</script>
