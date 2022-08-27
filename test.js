const axios = require('axios');
const { url } = require('inspector');

const getPrice = async (ticker) => {
    try {
        const res = await axios.get(`/${ticker}`, {
            baseURL: 'https://fmpcloud.io/api/v3/quote',
            params: {
                apikey: '696e4097428fce0782cecf50a40cb83a'
            }
        });
        return res.data;
    } catch (error) {
        console.error(error);
    }
};
getPrice('AAPL').then((data) => {
    console.log(data);
});
