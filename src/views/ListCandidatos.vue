<template>
  <v-container fluid>
    <v-dialog
      v-model="dialog_edit"
      width="600"
      persistent
    >
      <FormCandidatos :mode="mode" :candidato-id="candidatoId" @modalCandidato="dialog_edit = $event" @reload="listCandidatos()" @resetId="candidatoId = null"></FormCandidatos>
    </v-dialog>
    <v-dialog
      v-model="dialog_view"
      width="500"
    >
      <v-card>
        <ShowCandidato :candidato="candidato" @dialogView="dialog_view = $event"></ShowCandidato>
      </v-card>
    </v-dialog>
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-card elevation="3" outlined>
          <v-col cols="12">
            <v-row>
              <v-col cols="12" lg="4" md="4" sm="4">
                <v-text-field
                  v-model="search"
                  label="Pesquisar nome/cargo"
                  outlined
                  hide-details
                  dense
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="2" md="2" sm="2">
                <v-select
                  :items="levels"
                  item-text="title"
                  item-value="value"
                  v-model="experience_level"
                  label="Nível"
                  outlined
                  hide-details
                  dense
                ></v-select>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="4">
                <v-combobox
                  v-model="skills"
                  :items="skills_types"
                  label="Habilidades"
                  multiple
                  outlined
                  small-chips
                  dense
                  hide-details
                  clearable
                ></v-combobox>
              </v-col>
              <v-col cols="12" lg="2" md="2" sm="2" class="d-flex align-center">
                <v-btn block color="primary" @click="listCandidatos()"> Buscar </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-card>
      </v-col>

      <v-col cols="12" lg="10">
        <TableCandidatos :candidatos="candidatos" :per_page="per_page" :total_results="total_results" :loading="loading" @deleteIds="delCandidatos($event)" @editCandidato="edit($event)" @viewCandidato="view($event)" @novoCandidato="create()">
        </TableCandidatos>
      </v-col>

      <v-col cols="12" lg="10">
        <v-row>
          <v-col cols="4" lg="2" md="2" sm="2">
            <v-select
              :items="[5,10,15,20,25]"
              v-model="per_page"
              label="Por página"
              outlined
              hide-details
              @change="listCandidatos()"
              dense
            ></v-select>
          </v-col>
          <v-col cols="8" lg="10" md="10" sm="10" class="d-flex justify-end">
            <v-pagination
              v-model="page"
              :length="last_page"
              :total-visible="5"
              @input="listCandidatos()"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TableCandidatos from "@/components/CandidatosTable.vue";
import FormCandidatos from "@/components/FormCandidatos.vue";
import ShowCandidato from "@/components/ShowCandidato.vue";
import { getCandidatos, deleteCandidatos } from "@/services/services.js";
export default {
  components: {
    TableCandidatos,
    FormCandidatos,
    ShowCandidato
  },
  data: () => ({
    dialog_edit: false,
    dialog_view: false,
    candidatoId: null,
    candidato: {},
    mode: "create",
    search: "",
    levels: [
      { "title": "Todos", "value": "Todos" },
      { "title": "Junior", "value": "junior" },
      { "title": "Pleno", "value": "pleno" },
      { "title": "Sênior", "value": "senior" },
    ],
    job_title: "",
    experience_level: "Todos",
    candidatos: [],
    skills: [],
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
    page: 1,
    last_page: 1,
    per_page: 20,
    total_results: 0,
    loading: true,
    idsToDelete: []
  }),
  created() {
    this.listCandidatos();
  },
  methods: {
    listCandidatos() {
      this.loading = true;

      var params = {
        paginate: true,
        page: this.page,
        per_page: this.per_page,
        search: this.search,
        skills: this.skills,
        experience_level: this.experience_level
      }

      getCandidatos(params).then((response) => {
        this.candidatos = response.data;
        this.page = response.current_page;
        this.last_page = response.last_page;
        this.total_results = response.total;
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
    },
    delCandidatos(idsToDelete){
      deleteCandidatos(idsToDelete).then(() => {
        this.listCandidatos();
      })
      .catch(() => {
        this.loading = false;
      });
    },
    view(item){
      this.candidato = item;
      this.dialog_view = true;
    },
    create(){
      this.mode = 'create';
      this.dialog_edit = true;
    },
    edit(id){
      this.candidatoId = id;
      this.mode = 'edit';
      this.dialog_edit = true;
    }
  },
};
</script>
