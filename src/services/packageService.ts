import type { Package } from '../types/Package';
import axiosInstance from './axios';

const getPackages = async (): Promise<Package[]> => {
    const response = await axiosInstance.get<Package[]>('/packages');
    return response.data;
};

const getPackagesWithoutShipment = async (): Promise<Package[]> => {
    const response = await axiosInstance.get<Package[]>('/packages/not-shipment');
    return response.data;
};

const getPackageById = async (id: string): Promise<Package> => {
    const response = await axiosInstance.get<Package>(`/packages/${id}`);
    return response.data;
};

const createPackage = async (pkg: Omit<Package, 'id'>): Promise<Package> => {
    const response = await axiosInstance.post<Package>('/packages', pkg);
    return response.data;
};

const updatePackage = async (id: string, pkg: Partial<Omit<Package, 'id'>>): Promise<Package> => {
    const response = await axiosInstance.put<Package>(`/packages/${id}`, pkg);
    return response.data;
};

const deletePackage = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/packages/${id}`);
};

export default {
    getPackages,
    getPackagesWithoutShipment,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage,
};