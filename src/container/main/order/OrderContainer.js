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

const cn = classnames.bind(styles);

const getPaths = ['progress', 'complete', 'cancel'];

const OrderContainer = ({ tab }) => {

    const [open, setOpen] = useState(false);
    const history = useHistory();
    const reduxDispatch = useDispatch();
    const openDialog = useDialog();
    const reduxDate = useSelector((state) => state.date); // 각 조회할 날짜들을 갖고 있는 객체.


    const [loading, setLoading] = useState(false);
    const [orderList, setOrderList] = useState([]);

    const index = getPaths.findIndex(path => path === tab);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const setStartDate = date => {
        if (tab !== 'progress') {
            reduxDispatch(dateSet('order_' + tab, date, reduxDate['order_' + tab].end_date));
        }
    }
    const setEndDate = date => {
        if (tab !== 'progress') {
            reduxDispatch(dateSet('order_' + tab, reduxDate['order_' + tab].start_date, date));
        }
    }

    const setListfromResult = useCallback(
        (result) => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const callGETOrderListComplete = useCallback(async () => {
        /*
            주문 완료 내역 가져오기
        */
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const { start_date, end_date } = reduxDate.order_complete;
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const callGETOrderListCancel = useCallback(async () => {
        /*
            주문 취소 내역 가져오기
        */
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const { start_date, end_date } = reduxDate.order_cancel;
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    onChange={(e,path) => history.push(Paths.main.order + '/' + getPaths[path])}
                />
                {tab !== 'progress' && <IconButton className={styles['date-icon']} onClick={handleOpen}>
                    <img src ={DateIcon} alt="date"/>
                </IconButton>}
            </div>
            <div className={styles['content']}>
                {!loading && <OrderList list={orderList} />}
            </div>
            <Loading open={loading} />
            {tab && tab !== 'progress' && <BottomModal
                open={open} handleClose={handleClose} onClick={handleClose}
                startDate={reduxDate['order_' + tab].start_date} setStartDate={setStartDate}
                endDate={reduxDate['order_' + tab].end_date} setEndDate={setEndDate}
            />}
        </div>
    );
};

export default OrderContainer;
