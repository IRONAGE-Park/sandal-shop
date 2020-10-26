import React, { useCallback, useEffect } from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
/* Library */

import Paths from "./paths";
/* Custom Library */

import ErrorPage from './pages/ErrorPage';
import MainPage from './pages/MainPage';
import AuthPage from './pages/AuthPage';
/* Pages */

import DialogContainer from './container/assets/DialogContainer';
import LoadingContainer from './container/assets/LoadingContainer';
import LogoutContainer from './container/LogoutContainer';
/* Containers */


import './static/stylesheets/Root.scss';
import { useDispatch } from 'react-redux';
import { getCompany } from './store/company';
/* StyleSheets */

/* 
    아주나무 관리자 페이지.
    
    반응형 웹 디자인.
*/

const App = () => {
    const history = useHistory();
    const location = useLocation();
    const reduxDispatch = useDispatch();

    const judgementLogon = useCallback(() => {
        reduxDispatch(getCompany());
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인된 상태. */
            if (location.pathname.indexOf(Paths.main.index) !== 0) {
                // main 페이지가 아니면 메인 페이지로 보냄
                history.push(Paths.main.index);
            }
        } else {
            if (location.pathname.indexOf(Paths.auth.index) !== 0) {
                // 개인정보 처리 방침 페이지는 리다이렉트 시키지 않음.
                history.push(Paths.auth.signin);
            }
        }
    }, [history, location, reduxDispatch]);
    
    useEffect(() => {
        judgementLogon();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, []);

    return (
        <>
            <Switch>
                <Route path={Paths.main.index} component={MainPage} />
                <Route path={Paths.auth.index} component={AuthPage} />
                <Route path={Paths.main.logout} component={LogoutContainer} />
                <Route component={ErrorPage} />
            </Switch>
            <DialogContainer />
            <LoadingContainer />
        </>
    );
};

export default App;
