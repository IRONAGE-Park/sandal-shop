import axios from 'axios';
/* Library */

import Paths from '../paths';
/* Paths Object */

axios.defaults.headers['Context-Type'] = 'application/json';

export const requestGETCalculateDaily = async (JWT_TOKEN, start_date, end_date) => {
    /*
        가맹점 일일 매출 현황 리스트 Request API

        로그인 된 JWT_TOKEN을 첨부하여 일일 매출 현황을 가져오는 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/calculate/list_day';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.get(URL, {
        params: {
            start_date, end_date
        }
    });
    return res;
}

export const requestGETCalculateMonthly = async (JWT_TOKEN, start_date, end_date) => {
    /*
        가맹점 월별 매출 현황 리스트 Request API

        로그인 된 JWT_TOKEN을 첨부하여 월별 매출 현황을 가져오는 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/calculate/list_month';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.get(URL, {
        params: {
            start_date, end_date
        }
    });
    return res;
}

export const requestGETCalculateYearly = async (JWT_TOKEN, start_date, end_date) => {
    /*
        가맹점 연간 매출 현황 리스트 Request API

        로그인 된 JWT_TOKEN을 첨부하여 연간 매출 현황을 가져오는 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/calculate/list_year';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.get(URL, {
        params: {
            start_date, end_date
        }
    });
    return res;
}
