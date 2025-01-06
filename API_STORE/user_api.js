import { fetchDatas } from "./api";

export const fetchUserById = async ({user_id}) => {
  try {
    const user = await fetchDatas('get', `/users/${user_id}`);

    if (user) { 
      return user;
    } else {
      throw new Error('No User found'); 
    }

  } catch (error) {
    console.error(`Error fetching User error is: ${error}`);
  }
};