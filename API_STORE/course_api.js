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

export const HandleJoinRequest = async (data) => {
  try {
    const response = await fetchDatas('post', '/courses/handle-join-request', data);
    if (response) {
      return { success: true, data: response };
    }
  } catch (error) {
    console.error('Error during Approving the user:', error.response?.data?.message || error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
}

export const GetCourseByID = async (id) => {
  try {
    const response = await fetchDatas('get', `/courses/${id}`);
    if (response) {
      return { success: true, data: response };
    }
  } catch (error) {
    console.error('Error during Approving the user:', error.response?.data?.message || error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
}

export const SubmitRating = async (rating, course_id) => {
  try 
  {
    const response = await fetchDatas('post', `/courses/${course_id}/rate`, rating);
    if (response) {
      return { success: true, data: response };
    }
  } catch (error) {
    console.error(error.message)
    console.error('Error submitting the rating:', error.response?.data?.message || error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
}