<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="vagas"
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
    <template v-slot:item.type="{ item }">
      {{ item.type | formatType() }}
    </template>
    <template v-slot:item.modality="{ item }">
      {{ item.modality | formatModality() }}
    </template>
    <template v-slot:item.status="{ item }">
      {{ item.status | formatStatus() }}
    </template>
    <template v-slot:item.created_at="{ item }">
      {{ item.created_at | formatDate() }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-col>
        <v-row class="flex-nowrap" v-if="!singleSelect">
          <v-btn icon small color="primary" title="Editar vaga" class="mr-2" @click="$emit('editVaga', item.id)">
            <v-icon size="22">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon small color="primary" title="Ver mais" @click="$emit('viewVaga', item)">
            <v-icon size="22">mdi-open-in-new</v-icon>
          </v-btn>
        </v-row>
        <v-row class="flex-nowrap" v-else>
          <v-btn icon small color="red" title="Editar vaga" class="mr-2" @click="deleteOne(item)">
            <v-icon size="22">mdi-delete</v-icon>
          </v-btn>
        </v-row>
      </v-col>
    </template>
    <template v-slot:top>
      <v-col cols="12" lg="10" class="pb-4">
        <p class="ma-0">Total de <b>{{ total_results }} vagas</b></p>
      </v-col>
      <v-col cols="12" lg="10" class="py-0 d-flex flex-nowrap">
        <v-switch
          v-model="singleSelect"
          label="Selecionar"
          class="my-0"
        ></v-switch>
        <v-spacer></v-spacer>
        <v-btn small dark color="red" title="Deletar" class="mr-3" :disabled="selected.length == 0 ? true : false" v-if="singleSelect" @click="deleteSel()">
          <v-icon size="20">mdi-delete</v-icon>
          Deletar ({{ selected.length }})
        </v-btn>
        <v-btn small dark color="green" title="Deletar" class="mr-3" @click="$emit('novaVaga', true)" v-else>
          <v-icon size="20">mdi-plus</v-icon>
          Nova vaga
        </v-btn>
      </v-col>
    </template>
  </v-data-table>
</template>
  
<script>
import { format, parseISO } from "date-fns";
export default {
  props: {
    vagas: {
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
        text: "Título da vaga",
        align: "start",
        sortable: false,
        value: "title",
      },
      { text: "Empresa", value: "company", sortable: false },
      { text: "Tipo", value: "type", sortable: true },
      { text: "Modalidade", value: "modality", align: "center", sortable: true },
      { text: "Situação", value: "status", sortable: true },
      { text: "Publicada", value: "created_at", sortable: true },
      { text: "", value: "actions", align: "end", sortable: false },
    ],
  }),
  filters: {
    formatType(type){
      var types = {
        "in_person": "Presencial",
        "remote": "Remoto",
        "hybrid": "Híbrido"
      }

      return types[type];
    },
    formatModality(modality){
      var modalities = {
        "pj": "PJ",
        "clt": "CLT",
        "freelancer": "Freelancer"
      }

      return modalities[modality];
    },
    formatStatus(status){
      var status_types = {
        "active": "Ativa",
        "paused": "Pausada",
        "closed": "Encerrada"
      }

      return status_types[status];
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
  