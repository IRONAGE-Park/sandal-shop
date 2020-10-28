import React from 'react';
import styled from 'styled-components';
/* Library */

import styles from './Error.module.scss';

import logo from '../components/svg/error.svg';
import { ButtonBase } from '@material-ui/core';
/* Statics */

/*
    에러페이지.

    허용하지 않는 URL로 접속하거나, 올바르지 않은 데이터 전송 및
    활동을 했을 경우, 이 페이지 렌더링.
*/

const ErrorBox = styled.div`
    padding: 100px 0;
    text-align: center;
`; // 에러 페이지를 감싸고 있는 박스 div 스타일러.

const ErrorPage = ({ history, location }) => {
    /*
        에러 정보를 렌더링할 컴포넌트.
        
        에러 데이터를 가지고 오면 그 정보(에러 코드, 에러 URL) 렌더링.
    */
    return (
        <ErrorBox>
            <div className={styles['error']}>
                <div className={styles['mobile-image']}>
                    <p className={styles['mobile-text']}>Error: 404</p>
                    <img className={styles['image']} src={logo} alt="error" />
                </div>
                <h1 className={styles['title']}>페이지를 찾을 수 없습니다.</h1>
                <p className={styles['text']}>에러코드 : 404</p>
                <p className={styles['path']}>접속한 경로 : {location.pathname}</p>
                <ButtonBase className={styles['button']} onClick={() => history.push('/')}>
                    이전 페이지
                </ButtonBase>
            </div>
        </ErrorBox>
    );
};

export default ErrorPage;