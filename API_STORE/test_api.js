import { fetchDatas } from "./api";

export const fetchAllTests = async () => {
  try {
    const tests = await fetchDatas('get', '/tests');
    console.log('Tests: sdvgg', tests);
    if (tests) { 
      return tests;
    } else {
      throw new Error('No Tests found'); 
    }

  } catch (error) {
    console.error(`Error fetching Tests error is: ${error}`);
  }
}

export const submitTestData = async (data) => {
  try {
    const response = await fetchDatas('post', '/testSubmission/submit', data);
    console.log('Test submitted successfully:', response);
    return response;
  } catch (error) {
    console.error('Error submitting test:', error);
    throw error; // Rethrow the error for further handling if needed
  }
}

export const fetchleaderBoardForTest = async (testId) => {
  try {
    const result = await fetchDatas('get', `/leaderboard/test/${testId}`);
    console.log('Test Result:', result);
    return result;
  } catch (error) {
    console.error(`Error fetching test result: ${error}`);
    throw error; // Rethrow the error for further handling if needed
  }
}

export const getAllTestSubmission = async () => {
  try {
    const allTest = await fetchDatas('get', '/testSubmission/');
    return allTest;
  } catch (error) {
    console.error('Error fetching all test submissions:', error);
    throw error; // Rethrow the error for further handling if needed
  }
}