import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import styles from './CalculateContainer.module.scss';
import CustomTabs from '../../components/main/assets/Tabs';
import Paths from '../../paths';
import { useHistory } from 'react-router-dom';
import Loading from '../../components/assets/Loading';
import { useDialog } from '../../hooks/useDialog';
import { useSelector, useDispatch } from 'react-redux';
import { requestGETCalculateDaily, requestGETCalculateMonthly, requestGETCalculateYearly } from '../../api/calculate';
import CalculateList from '../../components/main/calculate/CalculateList';
import { dateSet } from '../../store/date';
import DateIcon from '../../components/svg/date.svg';
import PcDatePicker from '../../components/assets/PcDatePicker';
import BottomModal from '../../components/assets/BottomModal';
import { IconButton } from '@material-ui/core';

const cn = classnames.bind(styles);

const getPaths = ['daily', 'monthly', 'yearly'];

const CalculateContainer = ({ mode }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const openDialog = useDialog();
    const date = useSelector(state => state.date); // 각 조회할 날짜들을 갖고 있는 객체.
    const { close } = useSelector(state => state.header); // 헤더를 열고 닫기 위한 객체.

    const { calculate_daily, calculate_monthly, calculate_yearly } = date; // 리덕스에 저장된 배달 매출 현황 날짜

    const [calculateDaily, setCalculateDaily] = useState(calculate_daily); // 일간 배달 매출 세팅용 상태
    const [calculateMonthly, setCalculateMonthly] = useState(calculate_monthly); // 월간 배달 매출 세팅용 상태
    const [calculateYearly, setCalculateYearly] = useState(calculate_yearly); // 연간 배달 매출 세팅용 상태

    const [loading, setLoading] = useState(false);
    const [calculateList, setCalculateList] = useState([]);

    const index = getPaths.findIndex(path => path === mode); // 현재 보여줘야 할 내용 결정.

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
                case 0:
                    setCalculateDaily({ start_date, end_date });
                    break;
                case 1:
                    setCalculateMonthly({ start_date, end_date });
                    break;
                case 2:
                    setCalculateYearly({ start_date, end_date });
                    break;
                default: break;
                    // 잘못된 접근 예외 처리
            }
        }
    }, [index, openDialog]);

    const handleClickLookUp = useCallback(() => {
        switch (index) {
            case 0:
                dispatch(dateSet('calculate_daily', calculateDaily.start_date, calculateDaily.end_date));
                break;
            case 1:
                dispatch(dateSet('calculate_monthly', calculateMonthly.start_date, calculateMonthly.end_date));
                break;
            case 2:
                dispatch(dateSet('calculate_yearly', calculateYearly.start_date, calculateYearly.end_date));
                break;
            default: break;
        }
    }, [index, dispatch, calculateDaily, calculateMonthly, calculateYearly]);

    const setListfromResult = useCallback(
        result => {
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
                const { start_date, end_date } = calculate_daily;
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
    }, [calculate_daily, openDialog, setListfromResult]);
    const callGETCalculateMonthly = useCallback(async () => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const { start_date, end_date } = calculate_monthly;
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
    }, [calculate_monthly, openDialog, setListfromResult]);
    const callGETCalculateYearly = useCallback(async () => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const { start_date, end_date } = calculate_yearly;
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
    }, [calculate_yearly, openDialog, setListfromResult]);

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
            <div className={cn('tab', { close })}>
                <CustomTabs
                    idx={index}
                    categories={[
                        { ca_name: '일간 배달 매출' },
                        { ca_name: '월간 배달 매출' },
                        { ca_name: '연간 배달 매출' },
                    ]}
                    onChange={(e, path) => history.push(Paths.main.calculate + '/' + getPaths[path])}
                />
            </div>
            <IconButton className={cn('date-icon', { close })} onClick={handleOpen}>
                <img src ={DateIcon} alt="date"/>
            </IconButton>
            <PcDatePicker
                dateRange={index === 0 ? calculateDaily : (index === 1 ? calculateMonthly : calculateYearly)}
                type={index === 0 ? 'DAY' : (index === 1 ? 'MONTH' : 'YEAR')}
                handleChange={handleChange}
                handleClick={handleClickLookUp}
            />
            <div className={styles['content']}>
                {!loading && <CalculateList list={calculateList} type={mode} />}
            </div>
            <BottomModal
                open={open} handleClose={handleClose}
                dateRange={index === 0 ? calculateDaily : (index === 1 ? calculateMonthly : calculateYearly)}
                type={index === 0 ? 'DAY' : (index === 1 ? 'MONTH' : 'YEAR')}
                handleChange={handleChange}
                handleClick={handleClickLookUp}
            />
            <Loading open={loading} />
        </div>
    );
};

export default CalculateContainer;