import React from 'react';
import Message from '../../assets/Message';
import OrderItem from './OrderItem';

import styles from './Order.module.scss';


const OrderList = ({ list }) => {
    return (
        <div className={styles['content']}>
            <div className={styles['header']}>
                <div className={styles['order-time']}>주문 시간</div>
                <div className={styles['order-type']}>주문/종류</div>
                <div className={styles['order-info']}>배달 정보</div>
                <div className={styles['order-payment']}>결제</div>
                <div className={styles['order-state']}>상태</div>
            </div>
            <ul className={styles['list']}>
                {list.length ? list.map(item => <OrderItem key={item.order_id} item={item} />)
                : <Message msg="조회된 결과가 없습니다." />}
            </ul>
        </div>
    );
};

export default OrderList;