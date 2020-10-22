import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import styles from './CalculateContainer.module.scss';
import Tabs from '../../components/main/assets/Tabs';
import Paths from '../../paths';
import { useHistory } from 'react-router-dom';
import Loading from '../../components/assets/Loading';
import { useDialog } from '../../hooks/useDialog';
import { useSelector, useDispatch } from 'react-redux';
import { requestGETCalculateDaily, requestGETCalculateMonthly, requestGETCalculateYearly } from '../../api/calculate';
import CalculateList from '../../components/main/calculate/CalculateList';
import SelectBox from '../../components/assets/SelectBox';
import { dateSet } from '../../store/date';
import {Button } from '@material-ui/core';

const cn = classnames.bind(styles);

const getPaths = ['daily', 'monthly', 'yearly'];


const CalculateContainer = ({ mode }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const openDialog = useDialog();
    const date = useSelector(state => state.date); // 각 조회할 날짜들을 갖고 있는 객체.

    const { order_complete, order_cancel, calculate_daily, calculate_monthly, calculate_yearly } = date;

    const [loading, setLoading] = useState(false);
    const [calculateList, setCalculateList] = useState([]);

    const handleChange = useCallback((type, start, end) => {
        console.log(start);
        console.log(end);
        const start_date = new Date(start);
        const end_date = new Date(end);
        dispatch(dateSet(type, start_date, end_date));
    }, [date, dispatch]);

    const index = getPaths.findIndex(path => path === mode); // 현재 보여줘야 할 내용 결정.

    const setListfromResult = useCallback(
        (result) => {
            if (result.data.msg === '성공!') {
                setCalculateList(result.data.query.orders);
            } else {
                openDialog('리스트를 가지고 오는데 실패하였습니다.');
            }
        }, [openDialog]);

    const callGETCalculateDaily = useCallback(async () => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const { start_date, end_date } = date.calculate_daily;
                const result = await requestGETCalculateDaily(
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

    const callGETCalculateMonthly = useCallback(async () => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const { start_date, end_date } = date.calculate_monthly;
                const result = await requestGETCalculateMonthly(
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

    const callGETCalculateYearly = useCallback(async () => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const { start_date, end_date } = date.calculate_yearly;
                const result = await requestGETCalculateYearly(
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
                callGETCalculateDaily();
                break;
            case 1:
                callGETCalculateMonthly();
                break;
            case 2:
                callGETCalculateYearly();
                break;
            default:
                // 잘못된 접근 예외 처리
                history.push(Paths.main.calculate + '/daily');
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, callGETCalculateDaily, callGETCalculateMonthly, callGETCalculateYearly]);

    return (
        <div className={cn('container')}>
            <div className={cn('tab')}>
                <Tabs
                    idx={index}
                    categories={[
                        { ca_name: '일간 배달 매출' },
                        { ca_name: '월간 배달 매출' },
                        { ca_name: '연간 배달 매출' }
                    ]}
                    onChange={path => history.push(Paths.main.calculate + '/' + getPaths[path])}
                />
            </div>
            <div className={styles['pc-date-picker']}>
                <div className={styles['date-box']}>
                    <p className={styles['label']}>기간입력</p>
                    <SelectBox
                        value={calculate_daily.start_date.getFullYear()}
                        handleChange={e => handleChange('calculate_daily', `${e.target.value}/${(calculate_daily.start_date.getMonth() + 1)}/${calculate_daily.start_date.getDate()}`, calculate_daily.end_date)}
                        disabled={false}
                        list={Array.from({ length: 60 }).map((v, i) => i + 1970)}
                        name={Array.from({ length: 60 }).map((v, i) => i + 1970 + '년')}
                    />
                    <SelectBox
                        value={calculate_daily.start_date.getMonth() + 1}
                        handleChange={e => handleChange('calculate_daily', `${calculate_daily.start_date.getFullYear()}/${(e.target.value)}/${calculate_daily.start_date.getDate()}`, calculate_daily.end_date)}
                        disabled={false}
                        list={Array.from({ length: 12 }).map((v, i) => i + 1)}
                        name={Array.from({ length: 12 }).map((v, i) => i + 1 + '월')}
                    />
                    <SelectBox
                        value={calculate_daily.start_date.getDate()}
                        handleChange={e => handleChange('calculate_daily', `${calculate_daily.start_date.getFullYear()}/${(calculate_daily.start_date.getMonth() + 1)}/${e.target.value}`, calculate_daily.end_date)}
                        disabled={false}
                        list={Array.from({ length: 31 }).map((v, i) => i + 1)}
                        name={Array.from({ length: 31 }).map((v, i) => i + 1 + '일')}
                    />
                        <div className={styles['line']}/>
                    <SelectBox
                        value={calculate_daily.start_date.getFullYear()}
                        handleChange={e => handleChange('calculate_daily', `${e.target.value}/${(calculate_daily.start_date.getMonth() + 1)}/${calculate_daily.start_date.getDate()}`, calculate_daily.end_date)}
                        disabled={false}
                        list={Array.from({ length: 60 }).map((v, i) => i + 1970)}
                        name={Array.from({ length: 60 }).map((v, i) => i + 1970 + '년')}
                    />
                    <SelectBox
                        value={calculate_daily.start_date.getMonth() + 1}
                        handleChange={e => handleChange('calculate_daily', `${calculate_daily.start_date.getFullYear()}/${(e.target.value)}/${calculate_daily.start_date.getDate()}`, calculate_daily.end_date)}
                        disabled={false}
                        list={Array.from({ length: 12 }).map((v, i) => i + 1)}
                        name={Array.from({ length: 12 }).map((v, i) => i + 1 + '월')}
                    />
                    <SelectBox
                        value={calculate_daily.start_date.getDate()}
                        handleChange={e => handleChange('calculate_daily', `${calculate_daily.start_date.getFullYear()}/${(calculate_daily.start_date.getMonth() + 1)}/${e.target.value}`, calculate_daily.end_date)}
                        disabled={false}
                        list={Array.from({ length: 31 }).map((v, i) => i + 1)}
                        name={Array.from({ length: 31 }).map((v, i) => i + 1 + '일')}
                    />
                    <Button className={styles['search-btn']}>
                            조회
                    </Button>
                </div>
            </div>

            <div className={styles['content']}>

                {!loading &&
                    <CalculateList list={calculateList} type={mode} />}
            </div>
            <Loading open={loading} />
        </div>
    );
};

export default CalculateContainer;