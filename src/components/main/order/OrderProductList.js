import React from 'react';
import OrderProductItem from './OrderProductItem';

import styles from './OrderProduct.module.scss';

const OrderProductList = ({ list }) => {
    return (
        <ul className={styles['list']}>
            {list.length &&
                list.map((item, index) => (
                    <OrderProductItem key={index} item={item} />
                ))}
        </ul>
    );
};

export default OrderProductList;
