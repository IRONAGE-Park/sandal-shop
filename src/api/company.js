import axios from 'axios';
/* Library */

import Paths from '../paths';
/* Paths Object */

axios.defaults.headers['Context-Type'] = 'application/json';

export const requestGETMypageInfo = async () => {
    /*
        가맹점 회사 정보 Request API

        회사 정보를 가져오는 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#046b19d9-8979-413d-92aa-a865c00d02ba
    */
    const URL = Paths.api + 'user/company/main';

    const res = await axios.get(URL);
    return res;
}
