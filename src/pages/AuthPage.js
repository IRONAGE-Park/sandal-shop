import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import classnames from 'classnames/bind';
/* Library */

import Paths from '../paths';
/* Custom Library */

import AuthHeader from '../components/auth/AuthHeader';
import SignIn from '../container/auth/SignInContainer';
import SignUp from '../container/auth/SignUpContainer';
import Find from '../container/auth/FindContainer';
/* Components */

import styles from './Auth.module.scss';
import MobileHeader from '../components/assets/MobileHeader';
import PolicyPage from './PolicyPage';
/* Stylesheets */

const cx = classnames.bind(styles);

/*
    로그인 페이지 라우터.

    URL에 맞춰서 로그인 페이지 혹은 회원가입 페이지 렌더링.
*/

const { auth } = Paths;

const MobileTitleObject = {
    [auth.index]: {
        title: 'index',
    },
    [auth.signin]: {
        title: "로그인",
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
    [auth.policy]: {
        title: "약관 및 동의",
        back: auth.signin
    },
    [auth.policy + '/privacy']: {
        title: "약관 및 동의",
        back: auth.signin
    },
    [auth.policy + '/tos']: {
        title: "약관 및 동의",
        back: auth.signin
    }
}

const AuthPage = ({ history, location }) => {
    const { title, back } = MobileTitleObject[location.pathname] ? MobileTitleObject[location.pathname] : {};
    const [position, setPosition] = useState(false);

    useEffect(() => {
        /* URL이 바뀔 때마다 변경해 줌. */
        const { pathname } = location;
        setPosition(pathname === Paths.auth.signin || pathname === Paths.auth.find.index);
    }, [location]);

    useEffect(() => {
        if (location.pathname.indexOf('/complete') !== -1) {
            history.replace(location.pathname.replace('/complete', ''));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <MobileHeader title={title} back={back} />
            <div className={cx('auth', { center: position })}>
                <AuthHeader />
                <Switch>
                    <Route path={Paths.auth.signin} component={SignIn} />
                    <Route path={Paths.auth.signup} component={SignUp} />
                    <Route path={Paths.auth.find.index} component={Find} />
                    <Route path={Paths.auth.policy +'/:mode?'} component={PolicyPage} />
                    <Route render={({ history }) => history.push(Paths.auth.signin)} />
                </Switch>
            </div>
        </>
    );
};

export default AuthPage;