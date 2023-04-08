<template>
  <v-container fluid>
    <v-dialog
      v-model="dialog_edit"
      width="600"
    >
      <FormVagas :mode="mode" :vaga-id="vagaId" @modalVaga="dialog_edit = $event" @reload="listVagas()" @resetId="vagaId = null"></FormVagas>
    </v-dialog>
    <v-dialog
      v-model="dialog_view"
      width="500"
    >
      <v-card>
        <ShowVaga :vaga="vaga" @dialogView="dialog_view = $event"></ShowVaga>
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
                  label="Pesquisar vaga/empresa"
                  outlined
                  hide-details
                  dense
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="6" lg="3" md="3" sm="3">
                <v-select
                  :items="types"
                  item-text="title"
                  item-value="value"
                  v-model="type"
                  label="Tipo da vaga"
                  outlined
                  hide-details
                  dense
                ></v-select>
              </v-col>
              <v-col cols="6" lg="3" md="3" sm="3">
                <v-select
                  :items="modalities"
                  item-text="title"
                  item-value="value"
                  v-model="modality"
                  label="Modalidade da vaga"
                  outlined
                  hide-details
                  dense
                ></v-select>
              </v-col>
              <!-- <v-col cols="12" lg="3" md="3" sm="3">
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
              </v-col> -->
              <v-col cols="12" lg="2" md="2" sm="2" class="d-flex align-center">
                <v-btn block color="primary" @click="listVagas()"> Buscar </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-card>
      </v-col>

      <v-col cols="12" lg="10">
        <TableVagas :vagas="vagas" :per_page="per_page" :total_results="total_results" :loading="loading" @deleteIds="delVagas($event)" @editVaga="edit($event)" @viewVaga="view($event)" @novaVaga="create()">
        </TableVagas>
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
              @change="listVagas()"
              dense
            ></v-select>
          </v-col>
          <v-col cols="8" lg="10" md="10" sm="10" class="d-flex justify-end">
            <v-pagination
              v-model="page"
              :length="last_page"
              :total-visible="5"
              @input="listVagas()"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TableVagas from "@/components/VagasTable.vue";
import FormVagas from "@/components/FormVagas.vue";
import ShowVaga from "@/components/ShowVaga.vue";
import { getVagas, deleteVagas } from "@/services/services.js";
export default {
  components: {
    TableVagas,
    FormVagas,
    ShowVaga
  },
  data: () => ({
    dialog_edit: false,
    dialog_view: false,
    vagaId: null,
    vaga: {},
    mode: "create",
    search: "",
    types: [
      { "title": "Todas", "value": "Todas" },
      { "title": "Presencial", "value": "in_person" },
      { "title": "Remoto", "value": "remote" },
      { "title": "Híbrido", "value": "hybrid" },
    ],
    modalities: [
      { "title": "Todas", "value": "Todas" },
      { "title": "CLT", "value": "clt" },
      { "title": "PJ", "value": "pj" },
      { "title": "Freelancer", "value": "freelancer" },
    ],
    type: "Todas",
    modality: "Todas",
    vagas: [],
    page: 1,
    last_page: 1,
    per_page: 20,
    total_results: 0,
    loading: true,
    idsToDelete: []
  }),
  created() {
    this.listVagas();
  },
  methods: {
    listVagas() {
      this.loading = true;

      var params = {
        paginate: true,
        page: this.page,
        per_page: this.per_page,
        search: this.search,
        type: this.type,
        modality: this.modality,
        candidaturas: false
      }

      getVagas(params).then((response) => {
        this.vagas = response.data;
        this.page = response.current_page;
        this.last_page = response.last_page;
        this.total_results = response.total;
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
    },
    delVagas(idsToDelete){
      deleteVagas(idsToDelete).then(() => {
        this.listVagas();
      })
      .catch(() => {
        this.loading = false;
      });
    },
    view(item){
      this.vaga = item;
      this.dialog_view = true;
    },
    create(){
      this.mode = 'create';
      this.dialog_edit = true;
    },
    edit(id){
      this.vagaId = id;
      this.mode = 'edit';
      this.dialog_edit = true;
    }
  },
};
</script>
