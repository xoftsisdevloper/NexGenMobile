import axios from 'axios';

export const fetchDatas = async (methodName, url, data = null) => {
    // const API_ENDPOINT = "http://13.60.241.242:2000/api"; // Ensure correct port
    const API_ENDPOINT = "http://192.168.56.1:2000/api"; // Ensure correct port

    try {
        let response;
        const data_url = `${API_ENDPOINT}${url}`;

        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        };

        switch (methodName.toLowerCase()) {
            case 'get':
                response = await axios.get(data_url,data, config);
                console.log("Requesting test:", data_url, "Data:", data);
                break;
            case 'post':
                console.log("Requesting:", data_url, "Data:", data);
                response = await axios.post(data_url, data, config);
                break;
            case 'put':
                response = await axios.put(data_url, data, config);
                break;
            case 'delete':
                response = await axios.delete(data_url, config);
                break;
            default:
                throw new Error(`Invalid method: ${methodName}`);
        }

        return response.data;

    } catch (error) {
        console.log(API_ENDPOINT);
        
        console.error("Error fetching data:", error.response?.data || error.message);
        throw error;
    }
};
