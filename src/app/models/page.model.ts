import { Campaign } from "./campaign.model";

export interface Page<T> {
    pageNumber: number;
    size: number;
    items: T[];
}
