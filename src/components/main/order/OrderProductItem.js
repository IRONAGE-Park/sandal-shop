import React from 'react';
import { numberFormat } from '../../../lib/formatter';
import CoverImage from '../assets/CoverImage';

import styles from './OrderProduct.module.scss';

const OrderProductItem = ({ item }) => {
    console.log(item);

    const {
        item_name, item_option, item_price
    } = item;

    return (
        <li className={styles['item']}>
            <div className={styles['image']}>
                <CoverImage src={""} alt="item" />
            </div>
            <div className={styles['info']}>
                <p className={styles['name']}>{item_name}</p>
                <p className={styles['option']}>추가선택: {item_option ? "" : "없음"}</p>
                <p className={styles['value']}>{numberFormat(item_price)}원</p>
            </div>
        </li>
    );
};

export default OrderProductItem;