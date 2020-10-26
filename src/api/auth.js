import axios from 'axios';
/* Library */

import makeFormData from '../lib/makeFormData';
/* Custom Library */

import Paths from '../paths';
/* Paths */

axios.defaults.headers['Context-Type'] = 'application/json';

export const requestPOSTRegist = async ({
    email, name, shop_hp,
    password, password_confirm,
    shop_name, shop_post_num,
    shop_addr1, shop_addr2, shop_extra,
    shop_lat, shop_lng
}) => {
    /*
        가맹점 회원가입 Request API

        회원가입을 위한 데이터들을 모두 받아온 후 회원가입 요청을 보냄.

        문서 보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#fd8a2d6c-b5f6-484b-9e85-8d4952a31715
    */
    const URL = Paths.api + 'shop/register';

    const formData = makeFormData({
        email, name, shop_hp,
        password, password_confirm,
        shop_name, shop_post_num,
        shop_addr1, shop_addr2, shop_extra,
        shop_lat, shop_lng
    });

    const res = await axios.post(URL, formData);
    return res;
}

export const requestPOSTReceivePhoneAuth = async ({ pv_hp }) => {
    /*
        가맹점 휴대폰 인증번호 받기 Request API
        
        메세지를 보낼 휴대폰 번호를 받아오면 인증번호 요청을 보냄.
    
        문서 보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#d6d8e98e-70c1-48d0-9fe4-69d9b74a0f2e
    */
    const URL = Paths.api + 'mobile/auth';
    
    const formData = makeFormData({ pv_hp });

    const res = await axios.post(URL, formData);
    return res;
}

export const requestPOSTCheckPhoneAuth = async ({ pv_hp, pv_vnum }) => {
    /*
        가맹점 휴대폰 인증번호 확인 Request API
        
        메세지를 보낼 휴대폰 번호와 인증번호를 받아오면
        인증번호 확인 요청을 보냄.
    
        문서 보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#e4a057db-fa0b-4ad9-a434-7888ca4e8f7c
    */
    const URL = Paths.api + 'mobile/confirm';

    const formData = makeFormData({ pv_hp, pv_vnum });
    
    const res = await axios.post(URL, formData);
    return res;
}

export const requestPOSTLogin = async ({ email, password }) => {
    /*
        가맹점 로그인 Request API

        email과 password를 받아오면 로그인 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#689ba662-3758-4bd0-9dbf-8a0c0eea7b07
    */
    const URL = Paths.api + 'shop/login';

    const formData = makeFormData({ email, password });
    
    const res = await axios.post(URL, formData);
    return res;
};

export const requestPOSTLogout = async (JWT_TOKEN) => {
    /*
        가맹점 로그아웃 Request API

        로그인 된 JWT_TOKEN을 첨부하여 로그아웃 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#2aa08b42-dac7-488e-af2e-ef33cd33eb73
    */
    const URL = Paths.api + 'shop/logout';
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.post(URL);
    return res;
}

export const requestPOSTTokenRefresh = async (JWT_TOKEN) => {
    /*
        가맹점 토큰 새로고침 Request API

        로그인 된 JWT_TOKEN을 첨부하여 토큰 새로고침 요청을 보내고,
        새로운 토큰을 받아옴.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#e501251f-1031-461a-bd7d-312ee0c77f2b
    */
}

export const requestPOSTUserInfo = async (JWT_TOKEN) => {
    /*
        가맹점 로그인 정보 가져오기 Request API

        로그인 된 JWT_TOKEN을 첨부하여 유저 정보를 가져오는 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#3c7d7369-66f0-4795-b819-34dd67ea4d6b
    */
    const URL = Paths.api + 'shop/me';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.post(URL);
    return res;
};

export const requestPOSTFindID = async ({ name, hp }) => {
    /*
        가맹점 ID 찾기 Request API

        가맹점 유저 name과 휴대폰 번호를 받아오면 ID 찾기 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#4f0d9761-7e45-44b0-8ccb-4a29b099865d
    */
    const URL = Paths.api + 'shop/find_id';

    const formData = makeFormData({ name, hp });

    const res = await axios.post(URL, formData);
    return res;
};

export const requestPOSTFindPW = async ({ name, email, hp }) => {
    /*
        가맹점 PW 찾기 Request API

        가맹점 유저 name, email과 휴대폰 번호를 받아오면 PW 찾기 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#f7f537d7-aabb-49b2-9a19-3da5c425d724        
    */
    const URL = Paths.api + 'shop/find_pw';

    const formData = makeFormData({ name, email, hp });

    const res = await axios.post(URL, formData);
    return res;
};

export const requestPOSTChangePW = async ({ name, email, hp, pw, pw_c }) => {
    /*
        가맹점 PW 변경 Request API

        가맹점 유저 name, email과 휴대폰 번호를 받아온 후
        입력 받은 변경할 pw를 포함하여 PW 찾기 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#c2ef2c2c-fdd0-4603-9223-a41e28460917
    */
    const URL = Paths.api + 'shop/change_pw';

    const formData = makeFormData({ name, email, hp, pw, pw_c });

    const res = await axios.post(URL, formData);
    return res;
};

export const requestPOSTPushToken = async (JWT_TOKEN, native_token) => {
    /*
        가맹점 로그인 후 푸쉬 토큰 전송 Request API

        가맹점에서 정상적으로 로그인한 후에 그 기기로 푸쉬 알림을 보내기 위한
        토큰 등록 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#c2ef2c2c-fdd0-4603-9223-a41e28460917
    */
    const URL = Paths.api + 'user/pushToken';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.post(URL, { native_token });
    return res;
}