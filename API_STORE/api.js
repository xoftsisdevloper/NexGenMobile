import axios from 'axios';

export const fetchDatas = async (methodName, url, data = null) => {
    // const API_ENDPOINT = "https://nexgen-e.com/api"; // Ensure correct port
    const API_ENDPOINT = "http://192.168.1.108:5000/api"; // Ensure correct port

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
                break;
            case 'post':
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
        console.error("Error fetching data:", error.response?.data || error.message);
        throw error;
    }
};


