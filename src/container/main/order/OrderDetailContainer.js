import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import { requestGETOrderView, requestPUTOrderConfirm, requestPUTOrderDeliveryQuick, requestPUTOrderDeliveryDirect, requestPUTOrderDeliveryDirectMessage } from '../../../api/order';
import Loading from '../../../components/assets/Loading';
import { useDialog } from '../../../hooks/useDialog';
import styles from './OrderDetailContainer.module.scss';
import { ButtonBase } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import { numberFormat, stringToTel } from '../../../lib/formatter';
import Paths from '../../../paths';
import OrderProductList from '../../../components/main/order/OrderProductList';
import { isEmpty } from '../../../lib/formatChecker';
import StickerModal from '../../../components/modal/StickerModal';
import RejectModal from '../../../components/modal/RejectModal';

const cn = classnames.bind(styles);

const OrderDetailContainer = ({ order_id, modal }) => {
    const openDialog = useDialog();
    const history = useHistory();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState({});
    
    const {
        items, s_hp, s_name,
        delivery_req_time, sticker_id,
        s_addr1, s_addr2, settle_case,
        receipt_price, receipt_time,
        order_memo, delivery_memo,
        od_status
    } = orderData;

    const onOpenSticker = useCallback(() => history.push(Paths.main.order + '/sticker' + location.search), [location, history]);
    const onOpenReject = useCallback(() => history.push(Paths.main.order + '/reject' + location.search), [location, history]);
    const onCloseModal = useCallback(() => history.goBack(), [history]);
    
    const callPUTOrderConfirm = useCallback(async () => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const result = await requestPUTOrderConfirm(JWT_TOKEN, order_id);
                if (result.data.msg === '주문승인 완료') {
                    openDialog('주문이 정상적으로 접수되었습니다.', '');
                    setOrderData({
                        ...orderData,
                        od_status: 'shipping'
                    });
                }
            } catch (e) {
                openDialog("서버에 오류가 발생했습니다.", "잠시 후 다시 시도해 주세요.");
            }
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderData, order_id]);

    const callPUTOrderDeliveryQuick = useCallback(async () => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const result = await requestPUTOrderDeliveryQuick(JWT_TOKEN, order_id);
                if (result.data.msg === '주문승인 완료') {
                    openDialog('성공적으로 퀵커스를 요청하였습니다.', '');
                } else if (result.data.msg === '퀵커스 API 호출 실패. 퀵커스 측 문의 요망') {
                    openDialog('퀵커스 호출 실패!', '퀵커스 측에 문의해 주세요.');
                }
            } catch (e) {
                openDialog("서버에 오류가 발생했습니다.", "잠시 후 다시 시도해 주세요.");
            }
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderData, order_id]);

    const callPUTOrderDeliveryDirect = useCallback(async () => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const result = await requestPUTOrderDeliveryDirect(JWT_TOKEN, order_id);
                if (result.data.msg === '주문배달 완료') {
                    openDialog('고객님께 안전하게 전달하였습니다!', '');
                    setOrderData({
                        ...orderData,
                        od_status: 'delivery_complete'
                    });
                }
            } catch (e) {
                openDialog("서버에 오류가 발생했습니다.", "잠시 후 다시 시도해 주세요.");
            }
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderData, order_id]);

    const callPUTOrderDeliveryDirectMessage = useCallback(async () => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const result = await requestPUTOrderDeliveryDirectMessage(JWT_TOKEN, order_id);
                if (result.data.msg === '주문승인 완료') {
                    openDialog('고객님께 문자를 전송했습니다.', '');
                }
            } catch (e) {
                openDialog("서버에 오류가 발생했습니다.", "잠시 후 다시 시도해 주세요.");
            }
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderData, order_id]);

    const callGETOrderDetail = useCallback(async () => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const result = await requestGETOrderView(JWT_TOKEN, order_id);
                if (result.data.msg === "성공!") {
                    if (result.data.query.orders) {
                        setOrderData(result.data.query.orders);
                    } else {
                        openDialog("조회할 수 없는 주문 번호입니다.", "주문 번호를 확인해 주세요.");
                        history.push(Paths.main.order);
                    }
                } else {
                    openDialog("조회할 수 없는 주문 번호입니다.", "주문 번호를 확인해 주세요.");
                    history.push(Paths.main.order);
                }
            } catch (e) {
                openDialog("서버에 오류가 발생했습니다.", "잠시 후 다시 시도해 주세요.");
            }
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_id]);

    const onClickOrderConfirm = useCallback(() => 
        openDialog("정말 해당 주문을 접수하시겠습니까?", '', () => callPUTOrderConfirm(), true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [callPUTOrderConfirm]);
    const onClickOrderDeliveryQuick = useCallback(() =>
        openDialog("퀵커스 배달을 요청하시겠습니까?", '', () => callPUTOrderDeliveryQuick(), true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    , [callPUTOrderDeliveryQuick]);
    const onClickOrderDeliveryDirect = useCallback(() =>
        openDialog("배달을 완료하셨습니까?", '', () => callPUTOrderDeliveryDirect(), true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    , [callPUTOrderDeliveryDirect]);
    const onClickOrderDeliveryDirectMessage = useCallback(() =>
        openDialog("직접 배달을 하시겠습니까?", '', () => callPUTOrderDeliveryDirectMessage(), true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    , [callPUTOrderDeliveryDirectMessage]);

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
                        <div className={cn('border', 'overflow')}>
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
                                <p className={styles['i-value']}>{s_name}</p>
                            </div>
                            <div className={styles['i-content']}>
                                <p className={styles['i-name']}>연락처</p>
                                <p className={styles['i-value']}>{stringToTel(s_hp)}</p>
                            </div>
                            <div className={styles['i-content']}>
                                <p className={styles['i-name']}>배달 요청 시간</p>
                                <p className={styles['i-value']}>{delivery_req_time}</p>
                            </div>
                            <div className={styles['i-content']}>
                                <p className={styles['i-name']}>배달 주소</p>
                                <p className={styles['i-value']}>{s_addr1} {s_addr2}</p>
                            </div>
                            <div className={styles['i-content']}>
                                <p className={styles['i-name']}>요청 사항</p>
                                <p className={styles['i-value']}>{delivery_memo}</p>
                            </div>
                        </div>
                    </div>
                    <p className={cn('m-title', 'responsive')}>주문정보</p>
                    <div className={cn('box', 'small')}>
                        <div className={cn('border')}>
                            <div className={cn('i-content', 'deli')}>
                                <p className={styles['i-name']}>주문자</p>
                                <p className={styles['i-value']}>{s_name}</p>
                            </div>
                            <div className={cn('i-content', 'deli')}>
                                <p className={styles['i-name']}>연락처</p>
                                <p className={styles['i-value']}>{stringToTel(s_hp)}</p>
                            </div>
                            <div className={cn('i-content', 'deli')}>
                                <p className={styles['i-name']}>주문 종류</p>
                                <p className={styles['i-value']}>예약 주문</p>
                            </div>
                            <div className={cn('i-content', 'deli')}>
                                <p className={styles['i-name']}>요청 사항</p>
                                <p className={styles['i-value']}>{order_memo}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {sticker_id !== 0 && <div className={styles['sticker']}>
                    <div className={styles['mobile-view']}>
                        <p className={styles['m-title']}>
                            문구 서비스 신청 주문입니다.
                        </p>
                        <div className={styles['view-button-area']}>
                            <ButtonBase onClick={onOpenSticker} className={styles['view-button']}>
                                문구 서비스 이미지 보기
                            </ButtonBase>
                        </div>
                    </div>
                    <p className={styles['pc-view']} onClick={onOpenSticker}>문구 서비스 신청 주문입니다.(보기)</p>
                </div>}
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
                                    <span className={styles['table-value']}>
                                        {receipt_time}
                                        {!receipt_time && '미완료 결제'}
                                    </span>
                                </p>
                                <p className={styles['pay-table']}>
                                    <span className={styles['table-name']}>결제방식</span>
                                    <span className={styles['table-value']}>
                                        {settle_case === 'meet' && '만나서 결제'}
                                        {settle_case === 'card' && '카드 결제'}
                                        {settle_case === 'transfer' && '계좌 이체'}
                                        {settle_case === 'bank' && '무통장 입금'}
                                    </span>
                                </p>
                            </div>
                            <div className={styles['pay-price']}>
                                <div className={styles['pay-price-title']}>
                                    <p className={styles['pay-price-name']}>결제 금액</p>
                                    <div className={cn('pay-state', { complete: receipt_time === null })}>
                                        결제 {receipt_time ? '완료' : '미완료'}
                                    </div>
                                </div>
                                <p className={styles['pay-value']}>{numberFormat(receipt_price)}원</p>
                                <div className={styles['m-pay-state']}>
                                    <p className={styles['m-pay-state-name']}>결제여부</p>
                                    <p className={styles['m-pay-state-value']}>
                                        결제 {receipt_time ? '완료' : '미완료'}
                                    </p>
                                </div>
                            </div>
                            <div className={styles['pay-action']}>
                                {od_status === 'deposit_wait' && (settle_case === 'meet' ?
                                <>
                                    <ButtonBase onClick={onOpenReject} className={cn('button', 'reject')}>주문거절</ButtonBase>
                                    <ButtonBase onClick={onClickOrderConfirm} className={cn('button', 'receipt')}>주문접수</ButtonBase>
                                </> : <ButtonBase onClick={onOpenReject} className={cn('button', 'cancel')}>주문거절</ButtonBase>)}
                                {od_status === 'order_apply' &&
                                <>
                                    <ButtonBase onClick={onOpenReject} className={cn('button', 'reject')}>주문거절</ButtonBase>
                                    <ButtonBase onClick={onClickOrderConfirm} className={cn('button', 'receipt')}>주문접수</ButtonBase>
                                </>}
                                {od_status === 'shipping' && 
                                <>
                                    <ButtonBase onClick={onClickOrderDeliveryDirectMessage} className={cn('button', 'message')}>직접 배송</ButtonBase>
                                    <ButtonBase onClick={onClickOrderDeliveryDirect} className={cn('button', 'direct')}>배송 완료</ButtonBase>
                                    <ButtonBase disabled={settle_case === 'meet'} onClick={onClickOrderDeliveryQuick} className={cn('button', 'call', settle_case)}>
                                        {settle_case === 'meet' ? '만나서 결제' : '차량 호출'}
                                    </ButtonBase>
                                </>}
                                {od_status === 'order_cancel' && 
                                <ButtonBase className={cn('button', 'cancel')}>환불 완료</ButtonBase>}
                                {od_status === 'delivery_complete' && 
                                <ButtonBase className={cn('button', 'd_complete')}>배송 완료</ButtonBase>}
                                {od_status === 'order_complete' && 
                                <ButtonBase className={cn('button', 'o_complete')}>정산 완료</ButtonBase>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            <Loading open={loading} />
            {sticker_id !== 0 && <StickerModal open={modal === 'sticker'} handleClose={onCloseModal} order_id={order_id} />}
            <RejectModal open={modal === 'reject'} handleClose={onCloseModal} order_id={order_id} orderData={orderData} setOrderData={setOrderData} />
        </>
    );
};

export default OrderDetailContainer;