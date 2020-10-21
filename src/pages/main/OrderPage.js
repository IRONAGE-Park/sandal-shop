import React from 'react';
import qs from 'qs';
import OrderDetailContainer from '../../container/main/order/OrderDetailContainer';
import OrderContainer from '../../container/main/order/OrderContainer';

const OrderPage = ({ match, location }) => {
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });

    const { tab } = match.params; // 신규/처리중, 완료, 취소 리스트 선택
    const { order_id } = query; // 상세보기 시 사용할 order_id

    return (
        order_id ? <OrderDetailContainer order_id={order_id} />
        : <OrderContainer tab={tab} />
    );
};

export default OrderPage;