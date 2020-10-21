import axios from 'axios';
/* Library */

import Paths from '../paths';
/* Paths Object */

axios.defaults.headers['Context-Type'] = 'application/json';

export const requestGETMenuList = async (JWT_TOKEN, ca_id) => {
    /*
        가맹점 메뉴 리스트 Request API

        로그인 된 JWT_TOKEN와 카테고리 id를 첨부하여 가맹점의 판매 메뉴 리스트를 가져오는 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#d3067a3f-ecbd-4daf-90d3-199eba4bf3f1
    */
    const URL = Paths.api + 'shop/menu/list';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.get(URL, { params: { ca_id } });
    return res;
}

export const requestPUTUpdateMenu = async (JWT_TOKEN, item_id) => {
    /*
        가맹점 메뉴 판매 유무 변경 Request API

        로그인 된 JWT_TOKEN와 아이템 id를 첨부하여 가맹점의 판매 메뉴의 판매 상태를 변경하는 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#efd9d0de-6b32-47cb-8071-1554baeb186a
    */
    const URL = Paths.api + 'shop/menu/update';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.put(URL, { item_id });
    return res;
}