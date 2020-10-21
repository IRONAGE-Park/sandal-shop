import React from 'react';
/* Library */

import styles from './AuthHeader.module.scss';
/* Stylesheets */

import Logo from '../svg/auth/logo.svg';
/* Static */

export default () => (
    <div className={styles['header']}>
        <div className={styles['area']}>
            <div className={styles['container']}>
                <img className={styles['logo']} src={Logo} alt="로고" />
                <span className={styles['title']}>샌달 점주님 주문관리</span>
            </div>
        </div>
    </div>
);
