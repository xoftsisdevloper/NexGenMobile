import axios from 'axios';

export const fetchDatas = async (methodName, url) => {
    API_ENDPOINT="http://16.170.225.32:2000/api" 
    try {
        let response;
        const data_url = `${API_ENDPOINT}${url}`;
        switch (methodName.toLowerCase()) {
            case 'get':
                console.log(data_url);
                
                response = await axios.get(data_url);
                break;
            case 'post':
                response = await axios.post(data_url);
                break;
            case 'put':
                response = await axios.put(data_url);
                break;
            case 'delete':
                response = await axios.delete(data_url);
                break;
            default:
                throw new Error(`Invalid method: ${methodName}`);
        }

        return response.data;

    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        throw error;
    }
};