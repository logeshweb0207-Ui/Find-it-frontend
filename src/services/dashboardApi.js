import { getPending } from "./pendingApi";

export async function loadDashboard() {

    const result = await getPending(

        "kerala",

        "single"

    );

    return result;

}