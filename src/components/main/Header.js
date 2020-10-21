import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
/* Library */

import { ButtonBase } from '@material-ui/core';

import styles from './Header.module.scss';
import logo from '../svg/sandal_logo.svg';
// import logo from '../../components/svg/다람쥐.svg'
/* Statics */

import Paths from '../../paths';
import { dateToDay, dateToHHMM, dateToMMDD } from '../../lib/formatter';
/* Router Paths */

/*
    관리자 메인 헤더 컴포넌트.

    관리자 메인 페이지의 헤더에서 로고와 각 카테고리를 보여주고,
    이동할 수 있게 카테고리 링크 컴포넌트 리스트를 렌더링 함.
*/

const Timer = () => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        setInterval(() => {
            setDate(new Date());
        }, 60 * 1000);
    }, []);
    return (
        <div className={styles['timer']}>
            <span className={styles['date']}>{dateToMMDD(date)}</span>
            <span className={styles['day']}>({dateToDay(date.getDay())})</span>
            <span className={styles['time']}>{dateToHHMM(date)}</span>
        </div>
    );
};

/*
    헤더 컴포넌트.

    헤더 로고와 헤더가 보유한 카테고리 리스트 렌더링.
    카테고리 리스트는 각 카테고리로 이동할 수 있는 링크 컴포넌트 연결
*/
export default () => (
    <header>
        <div className={styles['container']}>
            <div className={styles['logo-area']}>
                <Link className={styles['logo']} to={Paths.main.index}>
                    <img className={styles['image']} src={logo} alt="logo" />
                </Link>
            </div>
            <div className={styles['action-area']}>
                <Timer />
                <div className={styles['logout']}>
                    <Link to={Paths.main.logout}>
                        <ButtonBase component="div" className={styles['button']}>
                            로그아웃
                        </ButtonBase>
                    </Link>
                </div>
            </div>
        </div>
    </header>
);
