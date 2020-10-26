import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import styles from './OrderContainer.module.scss';
import CustomTabs from '../../../components/main/assets/Tabs';
import { useHistory } from 'react-router-dom';
import Paths from '../../../paths';
import {
    requestGETOrderListCancel,
    requestGETOrderListComplete,
    requestGETOrderListProgress,
} from '../../../api/order';
import { useDialog } from '../../../hooks/useDialog';
import Loading from '../../../components/assets/Loading';
import OrderList from '../../../components/main/order/OrderList';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import DateIcon from '../../../components/svg/date.svg';
import BottomModal from '../../../components/assets/BottomModal';
import { dateSet } from '../../../store/date';
import PcDatePicker from '../../../components/assets/PcDatePicker';

const cn = classnames.bind(styles);

const getPaths = ['progress', 'complete', 'cancel'];

const OrderContainer = ({ tab }) => {

    const history = useHistory();
    const dispatch = useDispatch();
    const openDialog = useDialog();
    const date = useSelector(state => state.date); // 각 조회할 날짜들을 갖고 있는 객체.

    const { order_complete, order_cancel } = date; // 리덕스에 저장된 배달 매출 현황 날짜

    const [orderComplete, setOrderComplete] = useState(order_complete); // 주문 완료 목록 세팅용 상태
    const [orderCancel, setOrderCancel] = useState(order_cancel); // 주문 취소 목록 세팅용 상태

    const [loading, setLoading] = useState(false);
    const [orderList, setOrderList] = useState([]);

    const index = getPaths.findIndex(path => path === tab);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = useCallback((start, end) => {
        const start_date = new Date(start);
        const end_date = new Date(end);

        if (start_date.getTime() > end_date.getTime()) {
            openDialog("시작 날짜가 종료 날짜를 초과할 수 없습니다.");
            end_date.setTime(start_date.getTime());
        }
        if (end_date.getTime() > Date.now()) {
            openDialog("날짜가 당일을 초과할 수 없습니다.");
        } else {
            switch (index) {
                case 1:
                    setOrderComplete({ start_date, end_date });
                    break;
                case 2:
                    setOrderCancel({ start_date, end_date });
                    break;
                default: break;
                    // 잘못된 접근 예외 처리
            }
        }
    }, [index, openDialog]);

    const handleClickLookUp = useCallback(() => {
        switch (index) {
            case 1:
                dispatch(dateSet('order_complete', orderComplete.start_date, orderComplete.end_date));
                break;
            case 2:
                dispatch(dateSet('order_cancel', orderCancel.start_date, orderCancel.end_date));
                break;
            default: break;
        }
    }, [dispatch, index, orderCancel, orderComplete]);

    const setListfromResult = useCallback(
        result => {
            if (result.data.msg === '성공!') {
                setOrderList(result.data.query.orders);
            } else {
                openDialog('리스트를 가지고 오는데 실패하였습니다.');
            }
        }, [openDialog]);

    const callGETOrderListProgress = useCallback(async () => {
        /*
            주문 신규/처리중 내역 가져오기
        */
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const result = await requestGETOrderListProgress(JWT_TOKEN);
                setListfromResult(result);
            } catch (e) {
                openDialog('잘못된 접근입니다.');
            }
            setLoading(false);
        }
    }, [openDialog, setListfromResult]);

    const callGETOrderListComplete = useCallback(async () => {
        /*
            주문 완료 내역 가져오기
        */
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const { start_date, end_date } = order_complete;
                const result = await requestGETOrderListComplete(
                    JWT_TOKEN,
                    start_date,
                    end_date,
                );
                setListfromResult(result);
            } catch (e) {
                openDialog('잘못된 접근입니다.');
            }
            setLoading(false);
        }
    }, [openDialog, order_complete, setListfromResult]);

    const callGETOrderListCancel = useCallback(async () => {
        /*
            주문 취소 내역 가져오기
        */
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const { start_date, end_date } = order_cancel;
                const result = await requestGETOrderListCancel(
                    JWT_TOKEN,
                    start_date,
                    end_date,
                );
                setListfromResult(result);
            } catch (e) {
                openDialog('잘못된 접근입니다.');
            }
            setLoading(false);
        }
    }, [openDialog, order_cancel, setListfromResult]);

    useEffect(() => {
        switch (index) {
            case 0:
                callGETOrderListProgress();
                break;
            case 1:
                callGETOrderListComplete();
                break;
            case 2:
                callGETOrderListCancel();
                break;
            default:
                // 잘못된 접근 예외 처리
                history.push(Paths.main.order + '/progress');
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, callGETOrderListProgress, callGETOrderListComplete, callGETOrderListCancel,]);

    return (
        <div className={cn('container')}>
            <div className={cn('tab')}>
                <CustomTabs
                    idx={index}
                    categories={[
                        { ca_name: '신규/처리중' },
                        { ca_name: '완료' },
                        { ca_name: '취소' },
                    ]}
                    onChange={(e, path) => history.push(Paths.main.order + '/' + getPaths[path])}
                />
                {tab !== 'progress' && <IconButton className={styles['date-icon']} onClick={handleOpen}>
                    <img src ={DateIcon} alt="date"/>
                </IconButton>}
            </div>
            {index !== 0 && <PcDatePicker
                dateRange={index === 1 ? orderComplete : orderCancel}
                type='DAY'
                handleChange={handleChange}
                handleClick={handleClickLookUp}
            />}
            <div className={styles['content']}>
                {!loading && <OrderList list={orderList} />}
            </div>
            {index !== 0 && <BottomModal
                open={open} handleClose={handleClose}
                dateRange={index === 1 ? orderComplete : orderCancel}
                type='DAY'
                handleChange={handleChange}
                handleClick={handleClickLookUp}
            />}
            <Loading open={loading} />
        </div>
    );
};

export default OrderContainer;
