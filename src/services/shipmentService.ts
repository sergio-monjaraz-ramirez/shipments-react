import type { Shipment } from "../types/Shipment";
import axiosInstance from "./axios";

 const getShipments = async (): Promise<Shipment[]> => {
    const response = await axiosInstance.get<Shipment[]>('/shipments');
    return response.data;
};

 const getShipmentById = async (id: string): Promise<Shipment> => {
    const response = await axiosInstance.get<Shipment>(`/shipments/${id}`);
    return response.data;
};

 const createShipment = async (shipment: Omit<Shipment, 'id'>): Promise<Shipment> => {
    const response = await axiosInstance.post<Shipment>('/shipments', shipment);
    return response.data;
};

 const updateShipment = async (id: string, shipment: Partial<Shipment>): Promise<Shipment> => {
    const response = await axiosInstance.put<Shipment>(`/shipments/${id}`, shipment);
    return response.data;
};

 const deleteShipment = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/shipments/${id}`);
};

export default {
    getShipments,
    getShipmentById,
    createShipment,
    updateShipment,
    deleteShipment,
};  