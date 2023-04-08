<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="candidatos"
    :items-per-page="per_page"
    class="elevation-1"
    hide-default-footer
    :loading="loading"
    no-data-text="Sem registros no momento"
    :header-props="headerProps"
    :single-select="!singleSelect"
    :show-select="singleSelect"
    checkbox-color="primary"
  >
    <template v-slot:item.experience_level="{ item }">
      {{ item.experience_level | formatExperience() }}
    </template>
    <template v-slot:item.created_at="{ item }">
      {{ item.created_at | formatDate() }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-col>
        <v-row class="flex-nowrap" v-if="!singleSelect">
          <v-btn icon small color="primary" title="Editar candidato" class="mr-2" @click="$emit('editCandidato', item.id)">
            <v-icon size="22">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon small color="primary" title="Ver mais" @click="$emit('viewCandidato', item)">
            <v-icon size="22">mdi-open-in-new</v-icon>
          </v-btn>
        </v-row>
        <v-row class="flex-nowrap" v-else>
          <v-btn icon small color="red" title="Editar candidato" class="mr-2" @click="deleteOne(item)">
            <v-icon size="22">mdi-delete</v-icon>
          </v-btn>
        </v-row>
      </v-col>
    </template>
    <template v-slot:top>
      <v-col cols="12" lg="10" class="pb-4">
        <p class="ma-0">Total de <b>{{ total_results }} candidatos</b></p>
      </v-col>
      <v-col cols="12" lg="10" class="py-0 d-flex flex-nowrap">
        <v-switch
          v-model="singleSelect"
          label="Selecionar"
          class="my-0"
        ></v-switch>
        <v-spacer></v-spacer>
        <v-btn small dark color="red" title="Deletar" :disabled="selected.length == 0 ? true : false" v-if="singleSelect" @click="deleteSel()">
          <v-icon size="20">mdi-delete</v-icon>
          Deletar ({{ selected.length }})
        </v-btn>
        <v-btn small dark color="green" title="Deletar" @click="$emit('novoCandidato', true)" v-else>
          <v-icon size="20" class="mr-1">mdi-account-plus</v-icon>
          Novo candidato
        </v-btn>
      </v-col>
    </template>
  </v-data-table>
</template>
  
<script>
import { format, parseISO } from "date-fns";
export default {
  props: {
    candidatos: {
      default: [],
    },
    per_page: {
      type: Number,
      default: 20,
    },
    total_results: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    singleSelect: false,
    selected: [],
    headerProps: {
      sortByText: "Filtrar por",
    },
    headers: [
      {
        text: "Nome",
        align: "start",
        sortable: false,
        value: "first_name",
      },
      { text: "Contato", value: "phone", sortable: false },
      { text: "Cargo", value: "job_title", sortable: true },
      { text: "Nível", value: "experience_level", sortable: true },
      { text: "Cadastrado", value: "created_at", sortable: true },
      { text: "", value: "actions", align: "end", sortable: false },
    ],
  }),
  filters: {
    formatExperience(experience){
      var experiences = {
        "junior": "Junior",
        "pleno": "Pleno",
        "senior": "Sênior"
      }

      return experiences[experience];
    },
    formatDate(date) {
      return format(parseISO(date), "dd/MM 'às' H:mm");
    },
  },
  methods:{
    deleteOne(id){
      this.selected = [];
      this.selected.push(id);
      this.deleteSel();
    },
    deleteSel(){
      var ids = [];

      this.selected.map((item) => {
        ids.push(item.id);
      });

      this.$emit('deleteIds', ids);
    }
  }
};
</script>
  