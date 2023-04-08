<template>
  <div>
    <v-card>
      <v-card-title>
        {{ candidato.first_name }}
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
                mdi-account
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Nome completo</v-list-item-title>
              <v-list-item-subtitle>{{ candidato.first_name }} {{ candidato.full_name }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider inset></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo">
                mdi-phone
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Contato</v-list-item-title>
              <v-list-item-subtitle>{{ candidato.phone }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider inset></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo">
                mdi-home
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Endereço</v-list-item-title>
              <v-list-item-subtitle>{{ candidato.address }}</v-list-item-subtitle>
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
              <p class="text-h5">Cargo</p>
              <p class="mb-0">{{ candidato.job_title }}</p>
            </v-col>
            <v-col cols="12">
              <p class="text-h5">Nível</p>
              <p class="mb-0">{{ candidato.experience_level | formatExperience() }}</p>
            </v-col>
            <v-col cols="12">
              <p class="text-h5">Experiências</p>
              <p class="mb-0">{{ candidato.experiences }}</p>
            </v-col>
            <v-col cols="12">
              <p class="text-h5">Habilidades</p>
              <p class="mb-0">
                <v-chip
                class="ma-2"
                color="indigo"
                dark
                small
                v-for="skill in JSON.parse(candidato.skills)"
                :key="skill"
              >
                {{ skill }}
              </v-chip>
              </p>
            </v-col>
          </v-tab-item>
          <v-tab-item>
            <template v-if="!loading">
              <v-list subheader v-if="vagas.length > 0">
                <v-subheader><b>{{ vagas.length }}</b>&nbsp; vagas</v-subheader>
                <v-list-item
                  v-for="vaga in vagas"
                  :key="vaga.id"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="vaga.title"></v-list-item-title>
                    <v-list-item-subtitle>{{ vaga.company }} - {{ vaga.type | formatType() }}</v-list-item-subtitle>
                  </v-list-item-content>
  
                  <v-list-item-icon>
                    <v-btn small dark color="red" title="Desistir" @click="delCandidatura(vaga.id, 'vaga')" v-if="checkCandidatura(vaga)">
                      Desistir
                    </v-btn>
                    <v-btn small color="primary" title="Candidate-se" @click="newCandidatura(vaga.id)" v-else>
                      Candidate-se
                    </v-btn>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
              <p class="text-center mt-5" v-else>Sem vagas</p>
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
          <v-tab-item>
            <template v-if="!loading">
              <v-list subheader v-if="candidaturas.length > 0">
                <v-subheader><b>{{ candidaturas.length }}</b>&nbsp; candidaturas</v-subheader>
                <v-list-item
                  v-for="candidatura in candidaturas"
                  :key="candidatura.id"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="candidatura.vaga.title"></v-list-item-title>
                    <v-list-item-subtitle>{{ candidatura.vaga.company }} - {{ candidatura.vaga.type | formatType() }}</v-list-item-subtitle>
                  </v-list-item-content>
  
                  <v-list-item-icon>
                    <v-btn icon title="Remover" @click="delCandidatura(candidatura.id, 'candidatura')">
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
import { getCandidaturas, createCandidatura, getVagas, deleteCandidatura } from "@/services/services.js";
export default {
  props: {
    candidato: {
      type: Object,
      default: {
        first_name: "",
        full_name: "",
        phone: "",
        address: "",
        job_title: "",
        experiences: "",
        skills: [],
        experience_level: ""
      }
    }
  },
  data: () => ({
    loading: false,
    tab: null,
    items: [
      'Sobre', 'Vagas', 'Candidaturas',
    ],
    candidaturas: [],
    vagas: [],
  }),
  filters:{
    formatExperience(experience){
      var experiences = {
        "junior": "Junior",
        "pleno": "Pleno",
        "senior": "Sênior"
      }

      return experiences[experience];
    },
    formatType(type){
      var types = {
        "in_person": "Presencial",
        "remote": "Remoto",
        "hybrid": "Híbrido"
      }

      return types[type];
    }
  },
  watch: {
    tab:{
      handler(val){
        switch (val) {
          case 1:
            this.listVagas();
            break;
          case 2:
            this.listCandidaturas();
            break;
        
          default:
            break;
        }
        
        return val
      }
    },
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
        candidato_id: this.candidato.id,
        vaga: true
      }

      getCandidaturas(params).then((response) => {
        this.candidaturas = response;
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
    },
    listVagas() {
      this.loading = true;

      var params = {
        status: 'active',
        candidaturas: true
      }

      getVagas(params).then((response) => {
        this.vagas = response;
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
    },
    newCandidatura(id){
      var params = {
        candidato_id: this.candidato.id,
        vaga_id: id
      }

      createCandidatura(params).then(() => {
        this.listVagas();
      })
      .catch(() => {
        this.loading = false;
      });
    },
    delCandidatura(id, origin){

      if (origin == 'vaga') {
        var vaga = this.vagas.find(vaga => vaga.id == id);
        var candidatura = vaga.candidaturas.find(candidatura => candidatura.vaga_id == id && candidatura.candidato_id == this.candidato.id);
        id = candidatura.id;
      }

      deleteCandidatura(id).then(() => {
        if (origin == 'vaga') {
          this.listVagas();
        } else {
          this.listCandidaturas();
        }
      })
      .catch(() => {
        this.loading = false;
      });
    },
    checkCandidatura(vaga){
      var check = vaga.candidaturas.find(candidatura => candidatura.candidato_id == this.candidato.id);
      
      return check;
    }
  },
};
</script>