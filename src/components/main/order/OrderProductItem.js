import React from 'react';
import { DBImageFormat, numberFormat } from '../../../lib/formatter';
import CoverImage from '../assets/CoverImage';

import styles from './OrderProduct.module.scss';

const OrderProductItem = ({ item }) => {
    const {
        item_name, item_option, item_price, item_img, item_qty
    } = item;

    return (
        <li className={styles['item']}>
            <div className={styles['image']}>
                <CoverImage src={DBImageFormat(item_img)[0]} alt="item" />
            </div>
            <div className={styles['info']}>
                <p className={styles['name']}>
                    {item_name} <span className={styles['qty']}>{item_qty}개</span>
                </p>
                <p className={styles['option']}>
                    추가선택: {item_option ? item_option : "없음"}
                    {/* <span className={styles['m-qty']}>수량: {item_qty}개</span> */}
                </p>
                <p className={styles['value']}>{numberFormat(item_price)}원</p>
            </div>
        </li>
    );
};

export default OrderProductItem;