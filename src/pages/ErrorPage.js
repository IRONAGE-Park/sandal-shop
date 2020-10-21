import React from 'react';
import styled from 'styled-components';
/* Library */

import logo from '../components/svg/sandal_logo.svg';
/* Statics */

/*
    에러페이지.

    허용하지 않는 URL로 접속하거나, 올바르지 않은 데이터 전송 및
    활동을 했을 경우, 이 페이지 렌더링.
*/

const ErrorBox = styled.div`
    padding: 100px 0;
    text-align: center;
    img {
        width: 100px;
    }
`; // 에러 페이지를 감싸고 있는 박스 div 스타일러.

const ErrorPage = ({ match, history, location }) => {
    /*
        에러 정보를 렌더링할 컴포넌트.
        
        에러 데이터를 가지고 오면 그 정보(에러 코드, 에러 URL) 렌더링.
    */
    return (
        <ErrorBox>
            <img src={logo} alt="logo" />
            <h1>페이지를 찾을 수 없습니다.</h1>
            <p>{location.pathname}</p>
            <p>에러코드 : 404</p>
        </ErrorBox>
    );
};

export default ErrorPage;