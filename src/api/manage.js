import axios from 'axios';
/* Library */

import { dateToYYYYMMDDHHMMSS } from '../lib/formatter';
/* Custom Library */

import Paths from '../paths';
/* Paths Object */

axios.defaults.headers['Context-Type'] = 'application/json';

export const requestGETManageInfo = async (JWT_TOKEN) => {
    /*
        가맹점 운영 정보(영업시간, 휴무일) Request API

        로그인 된 JWT_TOKEN을 첨부하여 가맹점 운영 정보를 가져오는 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#78d7ccc2-a2ca-4fbb-af29-2ea1e381ebcf
    */
    const URL = Paths.api + 'shop/manage/info';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.get(URL);
    return res;
}

export const requestPUTManageTime = async (JWT_TOKEN, {
    weekday_flag, weekday_start, weekday_end,
    sat_flag, sat_start, sat_end,
    sun_flag, sun_start, sun_end,
}) => {
    /*
        가맹점 영업시간 수정 Reqeust API

        로그인 된 JWT_TOKEN과 수정할 정보들을 첨부하여 등록된 영업 시간 정보를 변경하는 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#1f0bcc25-2045-44a6-a56b-62be2e3ad1fc
    */
    const URL = Paths.api + 'shop/manage/time';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.put(URL, {
        weekday_flag, weekday_start, weekday_end,
        sat_flag, sat_start, sat_end,
        sun_flag, sun_start, sun_end
    });

    return res;
};

export const requestPUTManageHoliday = async (JWT_TOKEN, {
    holiday_flag,
    reg_closed_flag, reg_type, reg_week, reg_day,
    tem_closed_flag, tem_start_date, tem_end_date
}) => {
    /*
        가맹점 휴무일 수정 Reqeust API

        로그인 된 JWT_TOKEN과 수정할 정보들을 첨부하여 등록된 휴무일 정보를 변경하는 요청을 보냄.

        문서보기: https://cuzicompany.postman.co/collections/5909966-f695cab7-6878-eb55-7943-ad88e1ccfd65?version=latest&workspace=a40a7d1a-89f5-4f58-87d1-138b39b804b4#09557bf2-01c4-47ca-bad3-75eeb1a66d6d
    */
    const URL = Paths.api + 'shop/manage/holiday';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.put(URL, {
        holiday_flag,
        reg_closed_flag, reg_type: reg_type ? reg_type : 0, reg_week: reg_week ? reg_week : 1, reg_day: reg_day ? reg_day : 0,
        tem_closed_flag, tem_start_date: dateToYYYYMMDDHHMMSS(tem_start_date), tem_end_date: dateToYYYYMMDDHHMMSS(tem_end_date)
    });
    return res;
}