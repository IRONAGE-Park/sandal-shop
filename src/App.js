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

import MobileHeader from './components/assets/MobileHeader';
/* Components */

import './static/stylesheets/Root.scss';
/* StyleSheets */

/* 
    아주나무 관리자 페이지.
    
    반응형 웹 디자인.
*/

const { auth, main } = Paths;

const MobileTitleObject = {
    [auth.index]: {
        title: 'index',
        back: null
    },
    [auth.signin]: {
        title: "로그인",
        back: null
    },
    [auth.signup]: {
        title: "회원가입",
        back: auth.signin
    },
    [auth.signup + '/complete']: {
        title: "회원가입 완료",
        back: auth.signup
    },
    [auth.find.index]: {
        title: "아이디/비밀번호 찾기",
        back: auth.signin
    },
    [auth.find.id]: {
        title: "아이디 찾기",
        back: auth.find.index
    },
    [auth.find.id + '/complete']: {
        title: "아이디 찾기",
        back: auth.find.index
    },
    [auth.find.pw]: {
        title: "비밀번호 찾기",
        back: auth.find.index
    },
    [auth.find.pw + '/complete']: {
        title: "비밀번호 재설정",
        back: auth.find.index
    },
    [main.index]: {
        title: "샌달 가맹점 관리",
        back: null
    },
    [main.account]: {
        title: "내 정보 수정",
        back: main.index
    },
    [main.secession]: {
        title: "회원 탈퇴",
        back: main.account
    }
};

const App = () => {
    const history = useHistory();
    const location = useLocation();

    const { title, back } = MobileTitleObject[location.pathname] ? MobileTitleObject[location.pathname] : {};

    const judgementLogon = useCallback(() => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인된 상태. */
            if (location.pathname.indexOf(Paths.main.index) !== 0) {
                // main 페이지가 아니면 메인 페이지로 보냄
                history.push(Paths.main.index);
            }
        } else {
            if (location.pathname.indexOf(Paths.auth.index) !== 0) {
                history.push(Paths.auth.signin);
            }
        }
    }, [history, location])
    
    useEffect(() => {
        judgementLogon();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, []);

    return (
        <>
            <MobileHeader title={title} back={back} />
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
