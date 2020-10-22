import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import styles from './CalculateContainer.module.scss';
import Tabs from '../../components/main/assets/Tabs';
import Paths from '../../paths';
import { useHistory } from 'react-router-dom';
import Loading from '../../components/assets/Loading';
import { useDialog } from '../../hooks/useDialog';
import { useSelector } from 'react-redux';
import { requestGETCalculateDaily, requestGETCalculateMonthly, requestGETCalculateYearly } from '../../api/calculate';
import CalculateList from '../../components/main/calculate/CalculateList';

const cn = classnames.bind(styles);

const getPaths = ['daily', 'monthly', 'yearly'];

const CalculateContainer = ({ mode }) => {
    const history = useHistory();
    const openDialog = useDialog();
    const date = useSelector(state => state.date); // 각 조회할 날짜들을 갖고 있는 객체.

    const [loading, setLoading] = useState(false);
    const [calculateList, setCalculateList] = useState([]);

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
            <div className={styles['content']}>
                {!loading && 
                <CalculateList list={calculateList} type={mode} />}
            </div>
            <Loading open={loading} />
        </div>
    );
};

export default CalculateContainer;