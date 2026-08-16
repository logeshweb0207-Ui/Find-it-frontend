import API from "./api";

export const getPendingData = async (
    lottery = "kerala",
    digits = "single"
) => {

    const { data } = await API.get(
        `/pending/${lottery}/${digits}`
    );

    return data;

};