import axios from 'axios';
/* Library */

import { dateToYYYYMMDDHHMMSS } from '../lib/formatter';
/* Custom Library */

import Paths from '../paths';
/* Paths Object */

axios.defaults.headers['Context-Type'] = 'application/json';

export const requestGETCalculateDaily = async (JWT_TOKEN, s_date, e_date) => {
    /*
        가맹점 일일 매출 현황 리스트 Request API

        로그인 된 JWT_TOKEN을 첨부하여 일일 매출 현황을 가져오는 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/calculate/list_day';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const start_date = new Date(s_date);
    const end_date = new Date(e_date);
    end_date.setHours(23, 59, 59);
    const res = await axios.get(URL, {
        params: {
            start_date: dateToYYYYMMDDHHMMSS(start_date),
            end_date: dateToYYYYMMDDHHMMSS(end_date)
        }
    });
    return res;
}

export const requestGETCalculateMonthly = async (JWT_TOKEN, s_date, e_date) => {
    /*
        가맹점 월별 매출 현황 리스트 Request API

        로그인 된 JWT_TOKEN을 첨부하여 월별 매출 현황을 가져오는 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/calculate/list_month';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const start_date = new Date(s_date);
    const end_date = new Date(e_date);
    start_date.setDate(1);
    end_date.setDate(31);
    end_date.setHours(23, 59, 59);

    const res = await axios.get(URL, {
        params: {
            start_date, end_date
        }
    });
    return res;
}

export const requestGETCalculateYearly = async (JWT_TOKEN, s_date, e_date) => {
    /*
        가맹점 연간 매출 현황 리스트 Request API

        로그인 된 JWT_TOKEN을 첨부하여 연간 매출 현황을 가져오는 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/calculate/list_year';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const start_date = new Date(s_date);
    const end_date = new Date(e_date);
    start_date.setMonth(0, 1);
    end_date.setMonth(11, 31);
    end_date.setHours(23, 59, 59);
    const res = await axios.get(URL, {
        params: {
            start_date, end_date
        }
    });
    return res;
}
