import { fetchDatas } from "./api";

// Get User Details By Id
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

export const userSignUp = async ({ data }) => {
  
  try {
    
    const response = await fetchDatas('post', '/users/sign_up', data);

    if (response) {
      console.log('User signed up successfully:', response.message);
      return { success: true, data: response };
    }
  } catch (error) {    
    console.error('Error during user sign-up:', error.response?.data?.message || error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

export const userUpdate = async ({ data }) => {
  
  try {
    
    const response = await fetchDatas('put', `/users/${data.id}`, data);

    if (response) {
      console.log('User updated successfully:', response.message);
      return { success: true, data: response };
    }
  } catch (error) {    
    console.error('Error during user update:', error.response?.data?.message || error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

export const userSignIn = async({data}) => {
  try {
    
    const response = await fetchDatas('post', '/users/sign_in', data);

    if (response) {
      console.log('User signed in successfully:', response.message);
      return { success: true, data: response };
    }
  } catch (error) {    
    console.error('Error during user sign-in:', error.response?.data?.message || error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
}

export const userLogout = async () => {
  try {
    const response = await fetchDatas('post', '/users/sign_out', {});
    console.log("response tesxt", response);
    
      console.log('User signed out successfully:', response.message);
      return { success: true, message: response.message };
    
  } catch (error) {
    console.error('Error during user sign-out:', error.response?.data?.message || error.message || 'Network error');
    return { success: false, error: error.response?.data?.message || error.message || 'Network error' };
  }
};

export const userToggling = async (id, data) => {
  try {
    const response = await fetchDatas('put', `/users/update-userStatus/${id}`, data);
    console.log("The toggle Response", response);
    return {success: true, data: response}
  } catch (error) {
        return { success: false, error: error.response?.data?.message || error.message };
  }
}