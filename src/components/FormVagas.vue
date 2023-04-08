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
          <v-text-field
            v-model="title"
            :rules="titleRules"
            label="Título da vaga"
            outlined
            dense
            required
          ></v-text-field>

          <v-text-field
            v-model="company"
            :rules="companyRules"
            label="Empresa"
            outlined
            dense
            required
          ></v-text-field>

          <v-textarea
            v-model="description"
            :rules="descriptionRules"
            label="Descrição da vaga"
            rows="3"
            outlined
            dense
            required
          ></v-textarea>

          <v-textarea
            v-model="requirements"
            :rules="requirementsRules"
            label="Requisitos para a vaga"
            rows="3"
            outlined
            dense
            required
          ></v-textarea>

          <v-row class="mb-3">
            <v-col cols="12" lg="4" md="4" sm="4">
              <v-text-field
                v-model="salary"
                :rules="salaryRules"
                label="Salário"
                outlined
                type="number"
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4" md="4" sm="4">
              <v-select
                :items="types"
                :rules="typeRules"
                item-text="title"
                item-value="value"
                v-model="type"
                label="Tipo"
                outlined
                hide-details
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" lg="4" md="4" sm="4">
              <v-select
                :items="modalities"
                :rules="modalityRules"
                item-text="title"
                item-value="value"
                v-model="modality"
                label="Modalidade"
                outlined
                hide-details
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" v-if="mode == 'edit'">
              <v-select
                :items="statusType"
                item-text="title"
                item-value="value"
                v-model="status"
                label="Situação"
                outlined
                hide-details
                dense
              ></v-select>
            </v-col>
          </v-row>


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
  createVaga,
  showVaga,
  editVaga,
} from "@/services/services.js";
export default {
  props: {
    mode: String,
    vagaId: Number
  },
  components: {
    Alert,
  },
  data: () => ({
    loading: false,
    valid: true,
    message: {},
    pageTitle: "",
    title: "",
    company: "",
    description: "",
    requirements: "",
    salary: "",
    type: "",
    modality: "",
    status: "active",
    titleRules: [(v) => !!v || "O campo Título é obrigatório"],
    companyRules: [(v) => !!v || "O campo Empresa é obrigatório"],
    descriptionRules: [(v) => !!v || "O Descrição Nome é obrigatório"],
    requirementsRules: [(v) => !!v || "O campo Requisitos é obrigatório"],
    salaryRules: [(v) => !!v || "O campo Salário é obrigatório"],
    typeRules: [(v) => !!v || "O campo Tipo é obrigatório"],
    modalityRules: [(v) => !!v || "O campo Modalidade é obrigatório"],
    statusRules: [(v) => !!v || "O campo Situação é obrigatório"],
    types: [
      { "title": "Presencial", "value": "in_person" },
      { "title": "Remoto", "value": "remote" },
      { "title": "Híbrido", "value": "hybrid" },
    ],
    modalities: [
      { "title": "CLT", "value": "clt" },
      { "title": "PJ", "value": "pj" },
      { "title": "Freelancer", "value": "freelancer" },
    ],
    statusType: [
      { "title": "Ativa", "value": "active" },
      { "title": "Pausada", "value": "paused" },
      { "title": "Encerrada", "value": "closed" },
    ],
  }),
  created() {
    if (this.mode == "create") {
      this.pageTitle = "Nova vaga";
    } else {
      this.pageTitle = "Editar vaga";
      this.show();
    }
  },
  watch:{
    vagaId(){
      this.show();
    },
    mode(val){
      if (val == "create") {
        this.pageTitle = "Nova vaga";
      } else {
        this.pageTitle = "Editar vaga";
      }
    }
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        if (this.mode == "create") {
          this.pageTitle = "Nova vaga";
            this.create();
        } else {
          this.pageTitle = "Editar vaga";
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
        title: this.title,
        company: this.company,
        description: this.description,
        requirements: this.requirements,
        salary: this.salary,
        type: this.type,
        modality: this.modality 
      };

      createVaga(params).then((response) => {
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

      showVaga(this.vagaId).then((response) => {
          this.title = response.title;
          this.company = response.company;
          this.description = response.description;
          this.requirements = response.requirements;
          this.salary = parseInt(response.salary);
          this.type = response.type;
          this.modality = response.modality;
          this.status = response.status;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    edit() {
      this.loading = true;

      var params = {
        title: this.title,
        company: this.company,
        description: this.description,
        requirements: this.requirements,
        salary: this.salary,
        type: this.type,
        modality: this.modality ,
        status: this.status
      };

      editVaga(this.vagaId, params).then((response) => {
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
      this.$emit('modalVaga', false);
    }
  },
};
</script>
  