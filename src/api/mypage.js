import axios from 'axios';
/* Library */

import makeFormData from '../lib/makeFormData';
/* Custom Library */

import Paths from '../paths';
/* Paths Object */

axios.defaults.headers['Context-Type'] = 'application/json';

export const requestPOSTUpdateImage = async (JWT_TOKEN, profile_img) => {
    /*
        가맹점 프로필 이미지 변경 Request API

        로그인 된 JWT_TOKEN과 이미지 파일을 첨부하여 프로필 이미지를 변경하는 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#45031674-8053-42cc-921d-836df16e0969
    */
    const URL = Paths.api + 'shop/mypage/update_profileimg';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const formData = makeFormData({ profile_img, _method: 'put' });

    const res = await axios.post(URL, formData);
    return res;
}

export const requestPUTUpdateShop = async (JWT_TOKEN, shop_name) => {
    /*
        가맹점 이름 변경 Request API

        로그인 된 JWT_TOKEN과 변경할 가맹점 명을 첨부하여 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#e066b693-3e62-4b3b-b254-88ce917de481
    */
    const URL = Paths.api + 'shop/mypage/update_shop_name';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.put(URL, { shop_name });
    return res;
}

export const requestPUTUpdateName = async (JWT_TOKEN, name) => {
    /*
        가맹점 점주 이름 변경 Request API

        로그인 된 JWT_TOKEN과 변경할 가맹점 점주 성함을 첨부하여 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#9851cb4d-2b58-4b1e-8a36-9322be5b2e3b
    */
    const URL = Paths.api + 'shop/mypage/update_name';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.put(URL, { name });
    return res;
}

export const requestPUTUpdatePhoneNumber = async (JWT_TOKEN, shop_hp) => {
    /*
        가맹점 휴대폰 번호 변경 Request API

        로그인 된 JWT_TOKEN과 변경할 휴대폰 번호를 첨부하여 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#c7348ff9-b788-44a0-a00d-a43cace241de
    */
    const URL = Paths.api + 'shop/mypage/update_shop_hp';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.put(URL, { shop_hp });
    return res;
}

export const requestPUTUpdateAddress = async (JWT_TOKEN, shop_post_num, shop_addr1, shop_addr2, shop_lat, shop_lng) => {
    /*
        가맹점 주소 변경 Request API

        로그인 된 JWT_TOKEN과 변경할 주소, 상세 주소, 우편 번호, 위도 / 경도를 첨부하여 요청을 보냄.

        문서보기: 
    */
    const URL = Paths.api + 'shop/mypage/update_addr';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.put(URL, {
        shop_post_num, shop_addr1, shop_addr2,
        shop_lat, shop_lng
    });
   return res;
}

export const requestPUTUpdatePassword = async (JWT_TOKEN, pw_o, pw, pw_c) => {
    /*
        가맹점 비밀번호 변경 Request API

        로그인 된 JWT_TOKEN과 이전 가맹점 비밀번호, 변경할 가맹점 비밀번호를 첨부하여 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#d315b49a-3e5a-4c3c-9e0f-c8ac5d19a0f3
    */
   const URL = Paths.api + 'shop/mypage/update_pw';

   axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

   const res = await axios.put(URL, { pw_o, pw, pw_c });
   return res;
}

export const requestPUTSuccession = async (JWT_TOKEN, agree_succession) => {
    /*
        가맹점 회원 탈퇴 Request API

        로그인 된 JWT_TOKEN을 첨부하여 회원 탈퇴 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#066d2828-0548-4594-9d33-ee40328b6c6d
    */
    const URL = Paths.api + 'shop/mypage/update_status';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.put(URL, { agree_succession });
    return res;
}