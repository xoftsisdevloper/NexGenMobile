import { fetchDatas } from "./api";

export const fetchCourses = async () => {
  try {
    const courses = await fetchDatas('get', '/courses/');

    if (courses && courses.length > 0) { 
      return courses;
    } else {
      throw new Error('No courses found'); 
    }

  } catch (error) {
    console.error(`Error fetching courses error is: ${error}`);
  }
};

export const AddJoinCodeRequest = async (data) => {
  try {
    const response = await fetchDatas('post', `/courses/request-join`, data);
    if (response) {
      return { success: true, data: response };
    }
  } catch (error) {    
    console.error('Error during adding join code:', error.response?.data?.message || error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
}