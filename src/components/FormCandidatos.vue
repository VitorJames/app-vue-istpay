<template>
  <div>
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        {{ pageTitle }}
        <v-spacer></v-spacer>
        <v-btn icon color="red" @click="closeModal()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-4">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12" lg="6" md="6" sm="6">
              <v-text-field
                v-model="first_name"
                :rules="first_nameRules"
                label="Nome"
                outlined
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="6" md="6" sm="6">
              <v-text-field
                v-model="full_name"
                :rules="full_nameRules"
                label="Sobrenome"
                outlined
                dense
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-text-field
            v-model="phone"
            :rules="phoneRules"
            label="Contato"
            outlined
            dense
            required
          ></v-text-field>

          <v-text-field
            v-model="address"
            :rules="addressRules"
            label="Endereço"
            outlined
            dense
            required
          ></v-text-field>

          <v-text-field
            v-model="job_title"
            :rules="job_titleRules"
            label="Cargo"
            outlined
            dense
            required
          ></v-text-field>

          <v-textarea
            v-model="experiences"
            :rules="experiencesRules"
            label="Experiências"
            rows="3"
            outlined
            dense
            required
          ></v-textarea>

          <v-combobox
            v-model="skills"
            :items="skills_types"
            :rules="skillsRules"
            label="Habilidades"
            multiple
            outlined
            small-chips
            dense
            clearable
          ></v-combobox>

          <v-select
            :items="levels"
            item-text="title"
            item-value="value"
            v-model="experience_level"
            :rules="experience_levelRules"
            label="Nível"
            outlined
            dense
          ></v-select>

          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="validate"
          >
            {{ this.mode == "create" ? "Cadastrar" : "Editar" }}
          </v-btn>

          <v-btn text color="error" class="mr-4" @click="reset" v-if="mode == 'create'"> Limpar </v-btn>
          <v-btn text color="error" @click="closeModal()" v-else> Cancelar </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="65"></v-progress-circular>
    </v-overlay>

    <Alert :message="message"></Alert>
  </div>
</template>
  
  <script>
import Alert from "@/components/Notify";
import {
  createCandidato,
  showCandidato,
  editCandidato,
} from "@/services/services.js";
export default {
  props: {
    mode: String,
    candidatoId: Number
  },
  components: {
    Alert,
  },
  data: () => ({
    loading: false,
    valid: true,
    message: {},
    pageTitle: "",
    first_name: "",
    full_name: "",
    phone: "",
    address: "",
    job_title: "",
    experiences: "",
    skills: [],
    experience_level: "",
    first_nameRules: [(v) => !!v || "O campo Nome é obrigatório"],
    full_nameRules: [(v) => !!v || "O campo Sobrenome é obrigatório"],
    phoneRules: [(v) => !!v || "O campo Contato é obrigatório"],
    addressRules: [(v) => !!v || "O campo Endereço é obrigatório"],
    job_titleRules: [(v) => !!v || "O campo Cargo é obrigatório"],
    experiencesRules: [(v) => !!v || "O campo Experiências é obrigatório"],
    skillsRules: [(v) => !!v || "O campo Habilidades é obrigatório"],
    experience_levelRules: [(v) => !!v || "O campo Nível é obrigatório"],
    levels: [
      { "title": "Todos", "value": "Todos" },
      { "title": "Junior", "value": "junior" },
      { "title": "Pleno", "value": "pleno" },
      { "title": "Sênior", "value": "senior" },
    ],
    skills_types: [
      "Vue.Js",
      "React.Js",
      "React Native",
      "Laravel",
      "Adonis",
      "Angular",
      ".NET",
      "Lumen",
      "TypeScript",
      "Python",
      "Django",
      "Java",
      "Socket.IO"
    ],
  }),
  created() {
    if (this.mode == "create") {
      this.pageTitle = "Novo candidato";
    } else {
      this.pageTitle = "Editar candidato";
      this.show();
    }
  },
  watch:{
    candidatoId(){
      this.show();
    },
    mode(val){
      if (val == "create") {
        this.pageTitle = "Novo candidato";
      } else {
        this.pageTitle = "Editar candidato";
      }
    }
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        if (this.mode == "create") {
          this.pageTitle = "Novo candidato";
            this.create();
        } else {
          this.pageTitle = "Editar candidato";
            this.edit();
        }
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    create() {
      this.loading = true;

      var params = {
        first_name: this.first_name,
        full_name: this.full_name,
        phone: this.phone,
        address: this.address,
        job_title: this.job_title,
        experiences: this.experiences,
        skills: this.skills,
        experience_level: this.experience_level
      };

      createCandidato(params).then((response) => {
          this.loading = false;
          this.reset();
          this.closeModal();
          this.$emit('reload', true);
          this.message = {
            text: response.message,
            color: "success",
          };
        })
        .catch((error) => {
          this.loading = false;
          this.message = {
            text: error.message,
            color: "error",
          };
        });
    },
    show() {
      this.loading = true;

      showCandidato(this.candidatoId).then((response) => {
          this.first_name = response.first_name;
          this.full_name = response.full_name;
          this.phone = response.phone;
          this.address = response.address;
          this.job_title = response.job_title;
          this.experiences = response.experiences;
          this.skills = JSON.parse(response.skills);
          this.experience_level = response.experience_level;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    edit() {
      this.loading = true;

      var params = {
        first_name: this.first_name,
        full_name: this.full_name,
        phone: this.phone,
        address: this.address,
        job_title: this.job_title,
        experiences: this.experiences,
        skills: this.skills,
        experience_level: this.experience_level
      };

      editCandidato(this.candidatoId, params).then((response) => {
          this.loading = false;
          this.closeModal();
          this.$emit('reload', true);
          this.message = {
            text: response.message,
            color: "success",
          };
        })
        .catch((error) => {
          this.loading = false;
          this.message = {
            text: error.message,
            color: "error",
          };
        });
    },
    closeModal(){
      this.reset();
      this.$emit('resetId', true);
      this.$emit('modalCandidato', false);
    }
  },
};
</script>
  