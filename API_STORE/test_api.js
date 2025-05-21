import { test } from "@jest/globals";
import { fetchDatas } from "./api";

export const fetchAllTests = async () => {
  try {
    const tests = await fetchDatas('get', '/tests');
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

export const UpdateTestStatus = async (test_id, data) => {
  try {
    console.log("the test api", test_id)
    const response = await fetchDatas('put', `/tests/test-status/${test_id}`, data )
    return response;
  } catch (error) {
    console.error('Error updating test status:', error);
    throw error; // Rethrow the error for further handling if needed
  }
}

export const getTestById = async (id) => {
  try {
    console.log("Getting the tests of the id", id)
    const response = await fetchDatas('get', `/tests/${id}`);
    return response;
  } catch (error) {
    console.error('Error getting test :', error);
    throw error; // Rethrow the error for further handling if needed
  }
}