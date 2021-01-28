import React, { useCallback, useEffect, useReducer } from 'react';
import classnames from 'classnames/bind';
import { ButtonBase } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CustomTabs from '../../components/main/assets/Tabs';
import TimeBox from '../../components/main/operation/TimeBox';
import { isEmpty } from '../../lib/formatChecker';
import Paths from '../../paths';
import { getOperation, updateOperationHoli, updateOperationTime } from '../../store/operation';

import styles from './OperationContainer.module.scss';
import BoxHeader from '../../components/main/operation/BoxHeader';
import SelectBox from '../../components/assets/SelectBox';
import { dateToYYYYMMDD } from '../../lib/formatter';

const cn = classnames.bind(styles);


const getType = type => {
    switch (type) {
        case 0: return "매월";
        case 1: return "매주";
        default: return "매월";
    }
}
const getWeek = week => {
    switch (week) {
        case 1: return "첫째주";
        case 2: return "둘째주";
        case 3: return "셋째주";
        case 4: return "넷째주";
        default: return "첫째주";
    }
}
const getDay = day => {
    switch (day) {
        case 0: return "일요일";
        case 1: return "월요일";
        case 2: return "화요일";
        case 3: return "수요일";
        case 4: return "목요일";
        case 5: return "금요일";
        case 6: return "토요일";
        default: return "일요일";
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'ALL_CHANGE': return action.payload;
        case 'COMMON':
            return {
                ...state,
                [action.target]: action.value
            }
        default:
            return state;
    }
}

const OperationContainer = ({ mode }) => {
    const history = useHistory();
    const reduxDispatch = useDispatch();
    const redux_operation = useSelector(state => state.operation);
    const { close } = useSelector(state => state.header); // 헤더를 열고 닫기 위한 객체.

    const updateForm = mode.indexOf('update') !== -1; // 수정 상태인지 확인
    const displayMode = mode.indexOf('time') !== -1 ? 'time' : 'holi'; // 현재 보여질 뷰(영업시간, 휴무일)

    const [operation, setOperation] = useReducer(reducer, redux_operation);
    const {
        weekday_flag, weekday_start, weekday_end,
        sat_flag, sat_start, sat_end,
        sun_flag, sun_start, sun_end
    } = operation; // 영업시간 데이터
    const {
        holiday_flag,
        reg_closed_flag, reg_type, reg_week, reg_day,
        tem_closed_flag, tem_start_date, tem_end_date
    } = operation; // 휴무일 데이터

    const [tem_start_year, tem_start_month, tem_start_day] = typeof tem_start_date === 'string'
        ? tem_start_date.split('-').map(line => parseInt(line)) : [1970, 1, 1];
    // 임시 휴무 시작일
    
    const [tem_end_year, tem_end_month, tem_end_day] = typeof tem_end_date === 'string'
        ? tem_end_date.split('-').map(line => parseInt(line)) : [1970, 1, 1];
    // 임시 휴무 종료일

    const callPUTOperationTime = useCallback((e, direct = {}) => {
        const JWT_TOKEN = localStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토근이 존재함 => 로그인 된 상태. */
            reduxDispatch(updateOperationTime({
                JWT_TOKEN,
                timeObject: {
                    weekday_flag, weekday_start, weekday_end,
                    sat_flag, sat_start, sat_end,
                    sun_flag, sun_start, sun_end,
                    ...direct
                }
            }));
            if (isEmpty(direct)) {
                history.goBack();
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [operation]);

    const callPUTOperationHoli = useCallback((e, direct = {}) => {
        const JWT_TOKEN = localStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토근이 존재함 => 로그인 된 상태. */
            reduxDispatch(updateOperationHoli({
                JWT_TOKEN,
                holiObject: {
                    holiday_flag,
                    reg_closed_flag, reg_type, reg_week, reg_day,
                    tem_closed_flag, tem_start_date, tem_end_date,
                    ...direct
                }
            }));
            if (isEmpty(direct)) {
                history.goBack();
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [operation]);

    const handleChange = useCallback((target, value) => {
        setOperation({
            type: 'COMMON',
            target, value
        });
    }, []);

    const handleDirectChange = useCallback((type, target, value) => {
        // 토글 버튼으로 바로 변경했을 때 
        setOperation({
            type: 'COMMON',
            target, value
        });
        if (type === 'TIME') {
            callPUTOperationTime(null, { [target]: value });
        } else {
            callPUTOperationHoli(null, { [target]: value });
        }
    }, [callPUTOperationHoli, callPUTOperationTime]);

    useEffect(() => {
        // 렌더링 됐을 때 만약 리덕스에 운영정보 데이터가 없으면 받아옴.
        if (isEmpty(redux_operation)) {
            const JWT_TOKEN = localStorage.getItem('user_token');
            if (JWT_TOKEN) {
                /* 토근이 존재함 => 로그인 된 상태. */
                reduxDispatch(getOperation(JWT_TOKEN));
            }
        }
    }, [redux_operation, reduxDispatch]);

    useEffect(() => {
        // 리덕스에 있는 실제 운영정보 데이터가 변경되면 바로 반영해줌.
        // 또한 수정하기 페이지에서 수정완료를 누르지 않고 이동할 경우 수정 전 데이터로 반영.
        setOperation({
            type: 'ALL_CHANGE',
            payload: redux_operation
        });
    }, [redux_operation, mode]);

    return (
        <div className={cn('container', { updateForm })}>
            <div className={cn('tab', { close })}>
                <CustomTabs
                    idx={displayMode === 'time' ? 0 : 1}
                    categories={[{ ca_name: '영업시간' }, { ca_name: '휴무일' }]}
                    onChange={(e,path) =>
                        history.push(
                            Paths.main.operation +
                                '/' +
                                (path === 0 ? 'time' : 'holi'),
                        )
                    }
                />
            </div>
            <div className={styles['content']}>
                {displayMode === 'time' && !isEmpty(operation) && (
                    <div className={styles['box-area']}>
                        <TimeBox
                            title="평일 (월~금)"
                            data={{
                                flag: weekday_flag,
                                start: weekday_start,
                                end: weekday_end,
                            }}
                            type="weekday"
                            updateForm={updateForm}
                            handleChange={handleChange}
                            handleDirectChange={() =>
                                handleDirectChange(
                                    'TIME',
                                    'weekday_flag',
                                    !weekday_flag,
                                )
                            }
                        />
                        <TimeBox
                            title="토요일"
                            data={{
                                flag: sat_flag,
                                start: sat_start,
                                end: sat_end,
                            }}
                            type="sat"
                            updateForm={updateForm}
                            handleChange={handleChange}
                            handleDirectChange={() =>
                                handleDirectChange(
                                    'TIME',
                                    'sat_flag',
                                    !sat_flag,
                                )
                            }
                        />
                        <TimeBox
                            title="일요일"
                            data={{
                                flag: sun_flag,
                                start: sun_start,
                                end: sun_end,
                            }}
                            type="sun"
                            updateForm={updateForm}
                            handleChange={handleChange}
                            handleDirectChange={() =>
                                handleDirectChange(
                                    'TIME',
                                    'sun_flag',
                                    !sun_flag,
                                )
                            }
                        />
                    </div>
                )}
                {displayMode === 'holi' && !isEmpty(operation) && (
                    <div className={styles['box-area']}>
                        <div className={cn('holi-box', 'holiday')}>
                            <BoxHeader
                                title="공휴일"
                                checked={holiday_flag}
                                mode={updateForm}
                                handleChange={
                                    updateForm
                                        ? () =>
                                              handleChange(
                                                  'holiday_flag',
                                                  !holiday_flag,
                                              )
                                        : () =>
                                              handleDirectChange(
                                                  'HOLI',
                                                  'holiday_flag',
                                                  !holiday_flag,
                                              )
                                }
                            />
                            <div
                                className={cn('holi', {
                                    disabled: !tem_closed_flag,
                                })}
                            >
                                {holiday_flag ? '휴무' : '무휴'}
                            </div>
                        </div>
                        <div className={cn('holi-box', 'regular')}>
                            <BoxHeader
                                title="정기휴무"
                                checked={reg_closed_flag}
                                mode={updateForm}
                                handleChange={
                                    updateForm
                                        ? () =>
                                              handleChange(
                                                  'reg_closed_flag',
                                                  !reg_closed_flag,
                                              )
                                        : () =>
                                              handleDirectChange(
                                                  'HOLI',
                                                  'reg_closed_flag',
                                                  !reg_closed_flag,
                                              )
                                }
                            />
                            <div
                                className={cn('holi', {
                                    disabled: !tem_closed_flag,
                                })}
                            >
                                {updateForm ? <>
                                <SelectBox
                                    value={reg_type ? reg_type : 0}
                                    handleChange={e => handleChange('reg_type', parseInt(e.target.value))}
                                    disabled={!reg_closed_flag}
                                    list={Array.from({ length: 2 }).map((v, i) => i)}
                                    name={Array.from({ length: 2 }).map((v, i) => getType(i))}
                                />
                                {reg_type !== 1 && <SelectBox
                                    value={reg_week ? reg_week : 1}
                                    handleChange={e => handleChange('reg_week', parseInt(e.target.value))}
                                    disabled={!reg_closed_flag}
                                    list={Array.from({ length: 4 }).map((v, i) => i + 1)}
                                    name={Array.from({ length: 4 }).map((v, i) => getWeek(i + 1))}
                                />}
                                <SelectBox
                                    value={reg_day ? reg_day : 0}
                                    handleChange={e => handleChange('reg_day', parseInt(e.target.value))}
                                    disabled={!reg_closed_flag}
                                    list={Array.from({ length: 7 }).map((v, i) => i)}
                                    name={Array.from({ length: 7 }).map((v, i) => getDay(i))}
                                />
                                </>: <>
                                <p className={styles['reg-date']}>{getType(reg_type)}</p>
                                {reg_type !== 1 && <p className={styles['reg-date']}>{getWeek(reg_week)}</p>}
                                <p className={styles['reg-date']}>{getDay(reg_day)}</p>
                                </>}
                            </div>
                        </div>
                        <div className={cn('holi-box', 'temp')}>
                            <BoxHeader
                                title="임시휴무"
                                checked={tem_closed_flag}
                                mode={updateForm}
                                handleChange={
                                    updateForm
                                        ? () =>
                                              handleChange(
                                                  'tem_closed_flag',
                                                  !tem_closed_flag,
                                              )
                                        : () =>
                                              handleDirectChange(
                                                  'HOLI',
                                                  'tem_closed_flag',
                                                  !tem_closed_flag,
                                              )
                                }
                            />
                            <div
                                className={cn('holi', {
                                    disabled: !tem_closed_flag,
                                })}
                            >
                                <div className={styles['holi-cell']}>
                                {updateForm ?
                                    <>
                                        <div className={styles['tem-date']}>
                                            <p className={styles['label']}>시작</p>
                                            <SelectBox
                                                value={tem_start_year}
                                                handleChange={e => handleChange('tem_start_date', `${e.target.value}-${tem_start_month}-${tem_start_day}`)}
                                                disabled={!tem_closed_flag}
                                                list={Array.from({ length: 60 }).map((v, i) => i + 1970)}
                                                name={Array.from({ length: 60 }).map((v, i) => i + 1970 + '년')}
                                            />
                                            <SelectBox
                                                value={tem_start_month}
                                                handleChange={e => handleChange('tem_start_date', `${tem_start_year}-${e.target.value}-${tem_start_day}`)}
                                                disabled={!tem_closed_flag}
                                                list={Array.from({ length: 12 }).map((v, i) => i + 1)}
                                                name={Array.from({ length: 12 }).map((v, i) => i + 1 + '월')}
                                            />
                                            <SelectBox
                                                value={tem_start_day}
                                                handleChange={e => handleChange('tem_start_date', `${tem_start_year}-${tem_start_month}-${e.target.value}`)}
                                                disabled={!tem_closed_flag}
                                                list={Array.from({ length: 31 }).map((v, i) => i + 1)}
                                                name={Array.from({ length: 31 }).map((v, i) => i + 1 + '일')}
                                            />
                                        </div>
                                        <div className={styles['tem-date']}>
                                            <p className={styles['label']}>종료</p>
                                            <SelectBox
                                                value={tem_end_year}
                                                handleChange={e => handleChange('tem_end_date', `${e.target.value}-${tem_end_month}-${tem_end_day}`)}
                                                disabled={!tem_closed_flag}
                                                list={Array.from({ length: 60 }).map((v, i) => i + 1970)}
                                                name={Array.from({ length: 60 }).map((v, i) => i + 1970 + '년')}
                                            />
                                            <SelectBox
                                                value={tem_end_month}
                                                handleChange={e => handleChange('tem_end_date', `${tem_end_year}-${e.target.value}-${tem_end_day}`)}
                                                disabled={!tem_closed_flag}
                                                list={Array.from({ length: 12 }).map((v, i) => i + 1)}
                                                name={Array.from({ length: 12 }).map((v, i) => i + 1 + '월')}
                                            />
                                            <SelectBox
                                                value={tem_end_day}
                                                handleChange={e => handleChange('tem_end_date', `${tem_end_year}-${tem_end_month}-${e.target.value}`)}
                                                disabled={!tem_closed_flag}
                                                list={Array.from({ length: 31 }).map((v, i) => i + 1)}
                                                name={Array.from({ length: 31 }).map((v, i) => i + 1 + '일')}
                                            />
                                        </div>
                                    </> : `${dateToYYYYMMDD(tem_start_date, '.')} ~ ${dateToYYYYMMDD(tem_end_date, '.')}`}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className={styles['button-area']}>
                    <ButtonBase
                        className={cn('button', { confirm: updateForm })}
                        onClick={
                            updateForm
                                ? displayMode === 'time'
                                    ? callPUTOperationTime
                                    : callPUTOperationHoli
                                : () =>
                                      history.push(
                                          Paths.main.operation +
                                              '/' +
                                              displayMode +
                                              '_update',
                                      )
                        }
                    >
                        {updateForm ? '저장하기' : '수정하기'}
                    </ButtonBase>
                </div>
            </div>
        </div>
    );
};

export default OperationContainer;