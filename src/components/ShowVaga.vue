<template>
  <div>
    <v-card>
      <v-card-title>
        {{ vaga.title }}
        <v-spacer></v-spacer>
        <v-btn icon color="red" @click="closeModal()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-list>

          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo">
                mdi-domain
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Empresa</v-list-item-title>
              <v-list-item-subtitle>{{ vaga.company }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider inset></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo">
                mdi-web
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Tipo</v-list-item-title>
              <v-list-item-subtitle>{{ vaga.type | formatType() }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider inset></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo">
                mdi-briefcase-account
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Modalidade</v-list-item-title>
              <v-list-item-subtitle>{{ vaga.modality | formatModality() }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          
        </v-list>
        
        <v-tabs
          v-model="tab"
          background-color="indigo"
          grow
          dark
        >
          <v-tab
            v-for="item in items"
            :key="item"
          >
            {{ item }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-col cols="12">
              <p class="text-h5">Descrição da vaga</p>
              <p>{{ vaga.description }}</p>
            </v-col>
            <v-col cols="12">
              <p class="text-h5">Requisitos</p>
              <p>{{ vaga.requirements }}</p>
            </v-col>
            <v-col cols="12">
              <p class="text-h5">Salário</p>
              <p>{{ vaga.salary | formatValue() }}</p>
            </v-col>
          </v-tab-item>
          <v-tab-item>
            <template v-if="!loading">
              <v-list subheader v-if="candidaturas.length > 0">
                <v-subheader><b>{{ candidaturas.length }}</b>&nbsp; candidaturas</v-subheader>
                <v-list-item
                  v-for="candidatura in candidaturas"
                  :key="candidatura.id"
                >
                  <v-list-item-avatar outline>
                    <v-icon size="35">mdi-account-circle</v-icon>
                  </v-list-item-avatar>
  
                  <v-list-item-content>
                    <v-list-item-title v-text="candidatura.candidato.first_name"></v-list-item-title>
                    <v-list-item-subtitle>{{ candidatura.candidato.job_title }} - {{ candidatura.candidato.experience_level | formatExperience() }}</v-list-item-subtitle>
                  </v-list-item-content>
  
                  <v-list-item-icon>
                    <v-btn icon title="Remover" @click="delCandidatura(candidatura.id)">
                      <v-icon color="red">
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
              <p class="text-center mt-5" v-else>Sem candidaturas</p>
            </template>
            <v-col cols="12" class="py-5" v-else>
              <v-row justify="center">
                <v-progress-circular
                  indeterminate
                  color="indigo"
                  size="50"
                ></v-progress-circular>
              </v-row>
            </v-col>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { getCandidaturas, deleteCandidatura } from "@/services/services.js";
export default {
  props: {
    vaga: {
      type: Object,
      default: {
        title: "",
        company: "",
        description: "",
        requirements: "",
        salary: "",
        type: "",
        modality: "",
        status: ""
      }
    }
  },
  data: () => ({
    loading: false,
    tab: null,
    items: [
      'Descrição', 'Candidaturas',
    ],
    candidaturas: []
  }),
  filters:{
    formatValue(value){
      value = parseInt(value)
      return value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    },
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
    formatExperience(experience){
      var experiences = {
        "junior": "Junior",
        "pleno": "Pleno",
        "senior": "Sênior"
      }

      return experiences[experience];
    },
  },
  watch: {
    tab:{
      handler(val){
        if (val == 1) {
          this.listCandidaturas();
        }
        return val
      }
    }
  },
  methods: {
    closeModal(){
      this.tab = null;
      this.$emit('dialogView', false);
    },
    listCandidaturas() {
      this.loading = true;

      var params = {
        paginate: false,
        vaga_id: this.vaga.id,
        candidato: true
      }

      getCandidaturas(params).then((response) => {
        this.candidaturas = response;
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
    },
    delCandidatura(id){
      deleteCandidatura(id).then(() => {
        this.listCandidaturas();
      })
      .catch(() => {
        this.loading = false;
      });
    },
  },
};
</script>