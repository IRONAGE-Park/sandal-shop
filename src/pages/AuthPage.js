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
/* Stylesheets */

const cx = classnames.bind(styles);

/*
    로그인 페이지 라우터.

    URL에 맞춰서 로그인 페이지 혹은 회원가입 페이지 렌더링.
*/

const AuthPage = ({ history, location }) => {
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
        <div className={cx('auth', { center: position })}>
            <AuthHeader />
            <Switch>
                <Route path={Paths.auth.signin} component={SignIn} />
                <Route path={Paths.auth.signup} component={SignUp} />
                <Route path={Paths.auth.find.index} component={Find} />
            </Switch>
        </div>
    );
};

export default AuthPage;