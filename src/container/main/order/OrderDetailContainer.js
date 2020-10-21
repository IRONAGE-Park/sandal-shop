import React, { useCallback, useEffect, useState } from 'react';
import { requestGETOrderView } from '../../../api/order';
import Loading from '../../../components/assets/Loading';

const OrderDetailContainer = ({ order_id }) => {

    const [loading, setLoading] = useState(false);

    const callGETOrderDetail = useCallback(async () => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const result = await requestGETOrderView(JWT_TOKEN, order_id);
                console.log(result);
            } catch (e) {

            }
            setLoading(false);
        }
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