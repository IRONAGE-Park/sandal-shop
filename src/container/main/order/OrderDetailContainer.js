import React, { useCallback, useEffect, useState } from 'react';
import { requestGETOrderView } from '../../../api/order';
import Loading from '../../../components/assets/Loading';
import { useDialog } from '../../../hooks/useDialog';

const OrderDetailContainer = ({ order_id }) => {
    const openDialog = useDialog();

    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState({});

    console.log(orderData);

    const callGETOrderDetail = useCallback(async () => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const result = await requestGETOrderView(JWT_TOKEN, order_id);
                if (result.data.msg === "성공!") {
                    setOrderData(result.data.query.orders);
                } else {
                    openDialog("조회할 수 없는 주문 번호입니다.", "주문 번호를 확인해 주세요.");
                }
            } catch (e) {
                openDialog("서버에 오류가 발생했습니다.", "잠시 후 다시 시도해 주세요.");
            }
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_id]);

    useEffect(() => {
        callGETOrderDetail();
    }, [callGETOrderDetail]);
    
    return (
        <div>
            <Loading open={loading} />
        </div>
    );
};

export default OrderDetailContainer;