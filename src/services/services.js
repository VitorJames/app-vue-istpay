import axios from "axios";
import config from "@/services/config.js";

axios.defaults.baseURL = config.baseURLApi;

// Vagas
export async function getVagas(params) {
    const response = await axios.get(`/vagas`,{
        params: params
    });

    return response.data;
}

export async function showVaga(id) {
    const response = await axios.get(`/vagas/${id}`);

    return response.data;
}

export async function createVaga(params) {
    const response = await axios.post(`/vagas`,params);

    return response.data;
}

export async function editVaga(id,params) {
    const response = await axios.put(`/vagas/${id}`,params);

    return response.data;
}

export async function deleteVagas(ids) {
    ids = JSON.stringify(ids);
    const response = await axios.delete(`/vagas/${ids}`);

    return response.data;
}

// Candidaturas
export async function createCandidatura(params) {
    const response = await axios.post(`/candidaturas`,params);

    return response.data;
}

export async function getCandidaturas(params) {
    const response = await axios.get(`/candidaturas`,{
        params: params
    });

    return response.data;
}

export async function deleteCandidatura(id) {
    const response = await axios.delete(`/candidaturas/${id}`);

    return response.data;
}

// Candidatos
export async function getCandidatos(params) {
    const response = await axios.get(`/candidatos`,{
        params: params
    });

    return response.data;
}

export async function showCandidato(id) {
    const response = await axios.get(`/candidatos/${id}`);

    return response.data;
}

export async function createCandidato(params) {
    const response = await axios.post(`/candidatos`,params);

    return response.data;
}

export async function editCandidato(id,params) {
    const response = await axios.put(`/candidatos/${id}`,params);

    return response.data;
}

export async function deleteCandidatos(ids) {
    ids = JSON.stringify(ids);
    const response = await axios.delete(`/candidatos/${ids}`);

    return response.data;
}