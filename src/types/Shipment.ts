import type { Package } from "./Package";

export interface Shipment {
    id?: number;
    destination: string;
    createdAt:  string;
    status: 'pending' | 'in-transit' | 'delivered';
    packages: Array<Package>;
}