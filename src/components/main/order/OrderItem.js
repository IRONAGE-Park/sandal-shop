import React, { useCallback } from 'react';
import classnames from 'classnames/bind';
import { useHistory } from 'react-router-dom';
import Paths from '../../../paths';

import styles from './Order.module.scss';
import { numberFormat } from '../../../lib/formatter';

const cn = classnames.bind(styles);

const OrderItem = ({ item }) => {
    const history = useHistory(); 
    const {
        order_id, od_status, item_name,
        s_addr1, s_addr2, extra_item_count,
        receipt_price, receipt_time,
        total_price, total_qty
    } = item;

    const onClickDetailView = useCallback(() => {
        history.push(Paths.main.order + '?order_id=' + order_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_id]);

    console.log(item);

    return (
        <li className={styles['item']} onClick={onClickDetailView}>
            <div className={styles['view']}>
                <div className={cn('order-time')}>
                    {receipt_time.split(' ').map(line => <>{line}<br /></>)}
                </div>
                <div className={cn('order-type')}>
                    <p>{item_name}{extra_item_count > 0 && ` 외 ${extra_item_count}개`}</p>
                    <p className={styles['m-item-type']}>예약주문((문구서비스))</p>
                </div>
                <p className={styles['total-qty']}><b>총 수량 : </b>{total_qty}개</p>
                <div className={cn('order-info')}>
                    <p className={styles['addr-info']}>{s_addr1} {s_addr2}</p>
                    <p className={styles['deli-info']}>직접 배달 / ((시간))</p>
                </div>
                <div className={cn('order-payment')}>
                    <p className={styles['pay-info']}>{numberFormat(total_price)}원</p> 
                    <p className={styles['pay-complete']}>결제 완료</p>
                </div>
                <div className={cn('order-state')}>
                    <div className={styles['m-type-box']}>예약주문</div>
                    <div className={styles['m-type-box']}>문구서비스</div>
                    <div className={cn('status', od_status)}>
                        {od_status === "order_apply" && "접수"}
                    </div>
                </div>
            </div>
        </li>
    );
};

export default OrderItem;