import axios from 'axios';
/* Library */

import Paths from '../paths';
/* Paths Object */

axios.defaults.headers['Context-Type'] = 'application/json';

export const requestGETCategoryList = async (JWT_TOKEN) => {
    /*
        가맹점 분류 리스트 Request API

        로그인 된 JWT_TOKEN을 첨부하여 가맹점의 판매 분류 리스트를 가져오는 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#bd7a4e2d-c10d-47e7-8f67-97c2dd382c5e
    */
    const URL = Paths.api + 'shop/category/list';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.get(URL);
    return res;
}
