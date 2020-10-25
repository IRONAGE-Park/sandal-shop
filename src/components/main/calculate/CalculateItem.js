import React from 'react';
import classnames from 'classnames/bind';

import styles from './Calculate.module.scss';
import { numberFormat } from '../../../lib/formatter';

const cn = classnames.bind(styles);

const CalculateItem = ({ item }) => {
    const { 
        calculated_price, cancel_price,
        order_count, sales_price, send_cost,
        order_date
    } = item;
 

    return (
        <li className={styles['item']}>
            <div className={styles['view']}>
                <div className={cn('view-column', 'o-date')}><p className={styles['value']}>{order_date}</p></div>
                <div className={cn('view-column', 'o-count')}><p className={styles['value']}>{order_count}</p></div>
                <div className={cn('view-column', 'o-total')}><p className={styles['value']}>{numberFormat(sales_price)}</p></div>
                <div className={cn('view-column', 'o-cancel')}><p className={styles['value']}>{numberFormat(cancel_price)}</p></div>
                <div className={cn('view-column', 'o-sales')}><p className={styles['value']}>{numberFormat(sales_price - cancel_price)}</p></div>
                <div className={cn('view-column', 'service')}><p className={styles['value']}>0</p></div>
                <div className={cn('view-column', 'delivery')}><p className={styles['value']}>{numberFormat(send_cost)}</p></div>
                <div className={cn('view-column', 'calc-value')}><p className={styles['value']}>{numberFormat(parseInt(calculated_price ? calculated_price : 0))}</p></div>
            </div>
        </li>
    );
};

export default CalculateItem;