import axios from 'axios';
/* Library */

import Paths from '../paths';
/* Paths Object */

axios.defaults.headers['Context-Type'] = 'application/json';

export const requestGETOrderListProgress = async (JWT_TOKEN) => {
    /*
        가맹점 신규 주문 리스트 Request API

        로그인 된 JWT_TOKEN을 첨부하여 신규 주문 리스트를 가져오는 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/order/list_progress';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.get(URL);
    return res;
}

export const requestGETOrderListComplete = async (JWT_TOKEN, start_date, end_date) => {
    /*
        가맹점 완료 주문 리스트 Request API

        로그인 된 JWT_TOKEN을 첨부하여 완료 주문 리스트를 가져오는 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/order/list_complete';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    end_date.setHours(23, 59, 59);
    const res = await axios.get(URL, {
        params: {
            start_date,
            end_date
        }
    });
    return res;
}

export const requestGETOrderListCancel = async (JWT_TOKEN, start_date, end_date) => {
    /*
        가맹점 취소 주문 리스트 Request API

        로그인 된 JWT_TOKEN을 첨부하여 취소 주문 리스트를 가져오는 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/order/list_cancel';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    end_date.setHours(23, 59, 59);
    const res = await axios.get(URL, {
        params: {
            start_date, end_date
        }
    });
    return res;
}

export const requestGETOrderView = async (JWT_TOKEN, order_id) => {
    /*
        가맹점 주문 상세 보기 Request API

        로그인 된 JWT_TOKEN과 주문번호(order_id)를 첨부하여 주문 상세 정보를 가져오는 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/order/view';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.get(URL, {
        params: {
            order_id
        }
    });
    return res;
}

export const requestGETOrderSticker = async (JWT_TOKEN, order_id) => {
    /*
        가맹점 주문 문구 서비스 보기 Request API

        로그인 된 JWT_TOKEN과 주문번호(order_id)를 첨부하여 주문 문구 서비스 스티커 정보를 가져오는 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/order/sticker';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.get(URL, {
        params: {
            order_id
        }
    });
    return res;
}

export const requestPUTOrderConfirm = async (JWT_TOKEN, order_id) => {
    /*
        가맹점 주문 승인 Request API

        로그인 된 JWT_TOKEN과 주문번호(order_id)를 첨부하여 해당 주문에 승인 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/order/confirm';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.put(URL, { order_id });
    return res;
}

export const requestPUTOrderDeliveryQuick = async (JWT_TOKEN, order_id) => {
    /*
        가맹점 주문 승인 Request API

        로그인 된 JWT_TOKEN과 주문번호(order_id)를 첨부하여 해당 주문에 퀵커스 배달 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/order/delivery_quickers';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.put(URL, { order_id });
    return res;
}

export const requestPUTOrderDeliveryDirect = async (JWT_TOKEN, order_id) => {
    /*
        가맹점 주문 승인 Request API

        로그인 된 JWT_TOKEN과 주문번호(order_id)를 첨부하여 해당 주문에 직접 배달 완료 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/order/delivery_direct';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.put(URL, { order_id });
    return res;
}

export const requestPUTOrderDeliveryDirectMessage = async (JWT_TOKEN, order_id) => {
    /*
        가맹점 주문 승인 Request API

        로그인 된 JWT_TOKEN과 주문번호(order_id)를 첨부하여 해당 주문에 직접 배달 완료 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/order/delivery_direct_msg';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.put(URL, { order_id });
    return res;
}

export const requestPUTOrderCancel = async (JWT_TOKEN, order_id, cancel_reason) => {
    /*
        가맹점 주문 승인 Request API

        로그인 된 JWT_TOKEN과 주문번호(order_id), 취소 사유(cancle_reason)을 첨부하여
        해당 주문에 취소 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/order/reject';

    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.put(URL, { order_id, cancel_reason });
    return res;
}
