import type { Client } from '../types/Client';
import type { Summary } from '../types/Summary';
import type { TopClients } from '../types/TopClients';
import axiosInstance from './axios';


const getClients = async (): Promise<Client[]> => {
    const response = await axiosInstance.get<Client[]>('/clients');
    return response.data;
};

const getSummaryByClientId = async (id: string): Promise<Summary> => {
    const response = await axiosInstance.get<Summary>(`/clients/${id}/summary`);
    return response.data;
};

const getTopClients = async (): Promise<TopClients[]> => {
    const response = await axiosInstance.get<TopClients[]>(`/clients/top-clients`);
    return response.data;
};

const getClientById = async (id: string): Promise<Client> => {
    const response = await axiosInstance.get<Client>(`/clients/${id}`);
    return response.data;
};

const createClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
    const response = await axiosInstance.post<Client>('/clients', client);
    return response.data;
};

const updateClient = async (id: string, client: Partial<Client>): Promise<Client> => {
    const response = await axiosInstance.put<Client>(`/clients/${id}`, client);
    return response.data;
};

const deleteClient = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/clients/${id}`);
};

export default {
    getClients,
    getSummaryByClientId,
    getTopClients,  
    getClientById,
    createClient,
    updateClient,
    deleteClient,
};  