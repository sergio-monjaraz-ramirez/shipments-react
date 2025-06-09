import type { Client } from "./Client";

export interface Package {
    id?: number;
    weight: number;
    description: string;
    client: Client; 
}