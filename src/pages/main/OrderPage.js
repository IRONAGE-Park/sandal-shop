import React, { useEffect } from 'react';
import qs from 'qs';
import OrderDetailContainer from '../../container/main/order/OrderDetailContainer';
import OrderContainer from '../../container/main/order/OrderContainer';
import { useSelector } from 'react-redux';
import { useDialog } from '../../hooks/useDialog';
import Paths from '../../paths';

const OrderPage = ({ match, location, history }) => {
    const user = useSelector(state => state.user);
    const openDialog = useDialog();

    useEffect(() => {
        if (user.confirm !== 1) {
            // 권한을 가지지 않은 유저는 접근할 수 없음.
            openDialog('사용 승인 후 이용하실 수 있습니다.', '');
            history.push(Paths.main.index);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });

    const { tab } = match.params; // 신규/처리중, 완료, 취소 리스트 선택
    const { order_id } = query; // 상세보기 시 사용할 order_id

    useEffect(() => {
        if (!tab && !order_id) {
            history.replace(Paths.main.order + '/progress');
        }
    }, [history, order_id, tab]);

    return (
        order_id ? <OrderDetailContainer order_id={order_id} modal={tab} />
        : <OrderContainer tab={tab ? tab : 'progress'} />
    );
};

export default OrderPage;