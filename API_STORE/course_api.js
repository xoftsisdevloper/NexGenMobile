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