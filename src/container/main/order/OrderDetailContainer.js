import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import { requestGETOrderView, requestPUTOrderConfirm } from '../../../api/order';
import Loading from '../../../components/assets/Loading';
import { useDialog } from '../../../hooks/useDialog';
import styles from './OrderDetailContainer.module.scss';
import { ButtonBase } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import { numberFormat } from '../../../lib/formatter';
import Paths from '../../../paths';
import OrderProductList from '../../../components/main/order/OrderProductList';
import { isEmpty } from '../../../lib/formatChecker';

const cn = classnames.bind(styles);

const OrderDetailContainer = ({ order_id, modal }) => {
    const openDialog = useDialog();
    const history = useHistory();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState({});

    console.log(orderData);

    const {
        items, 
        s_addr1, s_addr2, settle_case,
        receipt_price, receipt_time
    } = orderData;

    const onOpenSticker = useCallback(() => history.push(Paths.order + '/sticker' + location.search), [location, history]);
    const onOpenReject = useCallback(() => history.push(Paths.order + '/reject' + location.search), [location, history]);
    const onCloseModal = useCallback(() => history.goBack(), [history]);
    

    const callPUTOrderConfirm = useCallback(async () => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const result = await requestPUTOrderConfirm(JWT_TOKEN, order_id);
                console.log(result);
            } catch (e) {
                openDialog("서버에 오류가 발생했습니다.", "잠시 후 다시 시도해 주세요.");
            }
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_id]);

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
        <>
            {!loading && !isEmpty(orderData) &&
            <div className={cn('container')}>
                <div className={cn('area', 'info')}>
                    <p className={styles['a-title']}>주문 상세 보기</p>
                    <p className={styles['m-title']}>주문상품</p>
                    <div className={cn('box')}>
                        <div className={cn('border')}>
                            <OrderProductList list={items} />
                        </div>
                    </div>
                </div>
                <div className={cn('area', 'info', 'delivery')}>
                    <p className={styles['a-title']}>배달/주문 정보</p>
                    <p className={cn('m-title', 'responsive', 'bt')}>배달정보</p>
                    <div className={cn('box', 'small')}>
                        <div className={cn('border')}>
                            <div className={styles['i-content']}>
                                <p className={styles['i-name']}>받는 분</p>
                                <p className={styles['i-value']}>임시</p>
                            </div>
                            <div className={styles['i-content']}>
                                <p className={styles['i-name']}>연락처</p>
                                <p className={styles['i-value']}>010-0000-0000</p>
                            </div>
                            <div className={styles['i-content']}>
                                <p className={styles['i-name']}>배달 요청 시간</p>
                                <p className={styles['i-value']}>{new Date().getFullYear()}</p>
                            </div>
                            <div className={styles['i-content']}>
                                <p className={styles['i-name']}>배달 주소</p>
                                <p className={styles['i-value']}>{s_addr1} {s_addr2}</p>
                            </div>
                            <div className={styles['i-content']}>
                                <p className={styles['i-name']}>요청 사항</p>
                                <p className={styles['i-value']}>임시</p>
                            </div>
                        </div>
                    </div>
                    <p className={cn('m-title', 'responsive')}>주문정보</p>
                    <div className={cn('box', 'small')}>
                        <div className={cn('border')}>
                            <div className={cn('i-content', 'deli')}>
                                <p className={styles['i-name']}>주문자</p>
                                <p className={styles['i-value']}>임시</p>
                            </div>
                            <div className={cn('i-content', 'deli')}>
                                <p className={styles['i-name']}>연락처</p>
                                <p className={styles['i-value']}>010-0000-0000</p>
                            </div>
                            <div className={cn('i-content', 'deli')}>
                                <p className={styles['i-name']}>이메일</p>
                                <p className={styles['i-value']}>admin@ajoonamu.com</p>
                            </div>
                            <div className={cn('i-content', 'deli')}>
                                <p className={styles['i-name']}>주문 종류</p>
                                <p className={styles['i-value']}>예약 주문</p>
                            </div>
                            <div className={cn('i-content', 'deli')}>
                                <p className={styles['i-name']}>요청 사항</p>
                                <p className={styles['i-value']}>임시</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles['sticker']}>
                    <div className={styles['mobile-view']}>
                        <p className={styles['m-title']}>
                            문구 서비스 신청 주문입니다.
                        </p>
                        <div className={styles['view-button-area']}>
                            <ButtonBase className={styles['view-button']}>
                                문구 서비스 이미지 보기
                            </ButtonBase>
                        </div>
                    </div>
                    <p className={styles['pc-view']}>문구 서비스 신청 주문입니다.(보기)</p>
                </div>
                <div className={cn('area', 'payment')}>
                    <p className={styles['a-title']}>결제 금액</p>
                    <p className={styles['m-title']}>결제 정보</p>
                    <div className={cn('box')}>
                        <div className={cn('border')}>
                            <div className={styles['pay-info']}>
                                <p className={styles['pay-table']}>
                                    <span className={styles['table-name']}>주문번호</span>
                                    <span className={styles['table-value']}>{order_id}</span>
                                </p>
                                <p className={styles['pay-table']}>
                                    <span className={styles['table-name']}>주문일시</span>
                                    <span className={styles['table-value']}>{receipt_time}</span>
                                </p>
                                <p className={styles['pay-table']}>
                                    <span className={styles['table-name']}>결제방식</span>
                                    <span className={styles['table-value']}>{settle_case}</span>
                                </p>
                            </div>
                            <div className={styles['pay-price']}>
                                <div className={styles['pay-price-title']}>
                                    <p className={styles['pay-price-name']}>결제 금액</p>
                                    <div className={styles['pay-state']}>결제 완료</div>
                                </div>
                                <p className={styles['pay-value']}>{numberFormat(receipt_price)}원</p>
                                <div className={styles['m-pay-state']}>
                                    <p className={styles['m-pay-state-name']}>결제여부</p>
                                    <p className={styles['m-pay-state-value']}>결제 완료</p>
                                </div>
                            </div>
                            <div className={styles['pay-action']}>
                                <ButtonBase className={cn('button', 'process')}>결제처리</ButtonBase>
                                <ButtonBase className={cn('button', 'reject')}>주문거절</ButtonBase>
                                <ButtonBase className={cn('button', 'receipt')}>주문접수</ButtonBase>
                                <ButtonBase className={cn('button', 'call')}>오토바이 호출</ButtonBase>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            <Loading open={loading} />
        </>
    );
};

export default OrderDetailContainer;