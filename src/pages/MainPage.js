import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
/* Library */

import { isEmpty } from '../lib/formatChecker';
/* Custom Library */

import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../store/user';
/* Redux */

import AccountPage from './main/AccountPage';
import SecessionPage from './main/SeccessionPage';
import OperationPage from './main/OperationPage';
import MenuPage from './main/MenuPage';
import OrderPage from './main/OrderPage';
import CalculatePage from './main/CalculatePage';
import SupportPage from './main/SupportPage';
import ErrorPage from './ErrorPage';
/* Pages */

import Header from '../components/main/Header';
import MainTitle from '../components/main/assets/MainTitle';
import Aside from '../components/main/Aside';
/* Components */

import styles from './Main.module.scss';
/* Statics */

import Paths from '../paths';
import IntroPage from './main/IntroPage';
/* Paths */

/*
    로그인 후 관리자 메인 페이지.

    유저 정보를 갖고 있으며, 각각의 서브 페이지에 접근하여 유저 정보를 통해
    관리자 데이터(관리자 정보 관리, 메뉴 관리, 운영 정보 관리, 주문 목록, 매출, 서포트 관리)를
    CRUD 할 수 있게 함.
*/

const MainPage = ({ location }) => {
    const reduxDispatch = useDispatch();
    
    const user = useSelector(state => state.user);
    const [asideOpen, setAsideOpen] = useState(false);

    useEffect(() => {
        if (isEmpty(user)) {
            const JWT_TOKEN = sessionStorage.getItem('user_token');
            if (JWT_TOKEN) {
                /* 토큰이 존재함 => 로그인 된 상태. */
                reduxDispatch(getUser(JWT_TOKEN));
            }
        }
    }, [user, reduxDispatch]);

    return (
        <div className={styles['app']}>
            <Header />
            <Aside open={asideOpen} setOpen={setAsideOpen} />
            <article className={styles['main']}>
                <div className={styles['content']}>
                    <MainTitle pathname={location.pathname} />
                    <Switch>
                        <Route path={Paths.main.index} component={IntroPage} exact/>
                        <Route path={Paths.main.account} component={AccountPage} />
                        <Route path={Paths.main.secession} component={SecessionPage} />
                        <Route path={Paths.main.operation + '/:mode?'} component={OperationPage} />
                        <Route path={Paths.main.menu} component={MenuPage} />
                        <Route path={Paths.main.order + '/:tab?'} component={OrderPage} />
                        <Route path={Paths.main.calculate.index} component={CalculatePage} />
                        <Route path={Paths.main.support.index} component={SupportPage} />
                        <Route component={ErrorPage} />
                    </Switch>
                </div>
            </article>
        </div>
    );
};

export default MainPage;
