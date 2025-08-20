import { DELAY_MS } from "./constant";

export const sleep = (ms = DELAY_MS): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}