import React, { useState } from 'react';
import classnames from 'classnames/bind';
import Message from '../../assets/Message';
import CalculateItem from './CalculateItem';

import styles from './Calculate.module.scss';
import { numberFormat } from '../../../lib/formatter';
import { ButtonBase } from '@material-ui/core';
import Direction from '../../svg/Direction';

const cn = classnames.bind(styles);

const CalculateList = ({ list, type }) => {

    const [openList, setOpenList] = useState(false);

    const total = list.reduce((prev, cur) => {
        return {
            calculated_price: prev.calculated_price + parseInt(cur.calculated_price),
            cancel_price: prev.cancel_price + cur.cancel_price,
            order_count: prev.order_count + cur.order_count,
            sales_price: prev.sales_price + parseInt(cur.sales_price),
            send_cost: prev.send_cost + parseInt(cur.send_cost)
        }
    }, {
        calculated_price: 0,
        cancel_price: 0,
        order_count: 0,
        sales_price: 0,
        send_cost: 0,
    });

    return (
        <div className={styles['content']}>
            <div className={styles['header']}>
                <div className={styles['calc-column']}>
                    정산{type === 'daily' && "일"}{type === 'monthly' && "월"}{type === 'yearly' && "연"}
                </div>
                <div className={styles['calc-column']}>주문수</div>
                <div className={styles['calc-column']}>주문합계</div>
                <div className={styles['calc-column']}>취소/환불</div>
                <div className={styles['calc-column']}>매출액</div>
                <div className={styles['calc-column']}>서비스 수수료</div>
                <div className={styles['calc-column']}>배달비</div>
                <div className={styles['calc-column']}>정산액</div>
            </div>
            <div className={styles['m-total']}>
                <div className={styles['m-content']}>
                    <div className={styles['total-header']}>
                        <div className={cn('total-row', 'total-price')}>
                            <div className={cn('total-name')}>합계</div>
                            <div className={cn('total-value')}>{numberFormat(total.calculated_price)}원</div>
                        </div>
                    </div>
                    <div className={styles['total-content']}>
                        <div className={cn('total-row')}>
                            <div className={cn('total-name')}>주문수</div>
                            <div className={cn('total-value')}>{total.order_count}</div>
                        </div>
                        <div className={cn('total-row')}>
                            <div className={cn('total-name')}>취소/환불</div>
                            <div className={cn('total-value')}>{numberFormat(total.cancel_price)}</div>
                        </div>
                        <div className={cn('total-row')}>
                            <div className={cn('total-name')}>매출액(단가+부가세+수수료)</div>
                            <div className={cn('total-value')}>{numberFormat(total.sales_price)}</div>
                        </div>
                        <div className={cn('total-row')}>
                            <div className={cn('total-name')}>배달 서비스 수수료</div>
                            <div className={cn('total-value')}>{numberFormat(0)}</div>
                        </div>
                        <div className={cn('total-row')}>
                            <div className={cn('total-name')}>배달비</div>
                            <div className={cn('total-value')}>{numberFormat(total.send_cost)}</div>
                        </div>
                        <div className={cn('total-row')}>
                            <div className={cn('total-name')}>정산액(단가+부가세)</div>
                            <div className={cn('total-value')}>{numberFormat(total.calculated_price ? total.calculated_price : 0)}</div>
                        </div>
                    </div>
                </div>
                <div className={styles['m-button-area']}>
                    <ButtonBase className={styles['m-open-button']} onClick={() => setOpenList(!openList)}>
                        <span className={styles['text']}>자세히보기</span>
                        <Direction vector={openList ? "BOTTOM" : "TOP"} />
                    </ButtonBase>
                </div>
            </div>
            <ul className={cn('list', { empty: list.length === 0, openList })}>
                {list.length ? list.map(item => <CalculateItem key={item.order_date} item={item} />)
                : <Message msg="조회된 결과가 없습니다." />}
            </ul>
        </div>
    );
};

export default CalculateList;