import { fetchDatas } from "./api";

export const fetchInstitutions = async () => {
  try {
    const ins = await fetchDatas('get', '/institution');
    return ins;
  } catch (error) {
    console.error(`Error fetching Institution error is: ${error}`);
  }
};
