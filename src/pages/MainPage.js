import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
/* Library */

import { isEmpty } from '../lib/formatChecker';
/* Custom Library */

import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../store/user';
import { setHeader } from '../store/header';
import {
    get_notice,
} from '../store/notice';
/* Redux */

import IntroPage from './main/IntroPage';
import AccountPage from './main/AccountPage';
import SecessionPage from './main/SeccessionPage';
import OperationPage from './main/OperationPage';
import MenuPage from './main/MenuPage';
import OrderPage from './main/OrderPage';
import CalculatePage from './main/CalculatePage';
import SupportPage from './main/SupportPage';
import ErrorPage from './ErrorPage';
import PolicyPage from './PolicyPage';
import NotificationPage from './main/NotificationPage';
/* Pages */

import Header from '../components/main/Header';
import MobileHeader from '../components/assets/MobileHeader';
import MainTitle from '../components/main/assets/MainTitle';
import Aside from '../components/main/Aside';
import { IconButton } from '@material-ui/core';
/* Components */

import styles from './Main.module.scss';
import Hamburger from '../components/svg/mobile_hamburger.svg';
/* Statics */

import Paths from '../paths';
/* Paths */

import { requestNotice } from '../api/notification';
/* api */


const { main } = Paths;

const MobileTitleObject = {
    [main.index]: {
        title: '샌달 가맹점 관리',
    },
    [main.account]: {
        title: '내 정보 수정',
        back: main.index,
    },
    [main.account + '/modal']: {
        title: '내 정보 수정',
        back: main.index,
    },
    [main.secession]: {
        title: '회원 탈퇴',
        back: main.account,
    },
    [main.operation]: {
        title: '운영 정보 관리',
    },
    [main.operation + '/time']: {
        title: '운영 정보 관리',
    },
    [main.operation + '/holi']: {
        title: '운영 정보 관리',
    },
    [main.operation + '/time_update']: {
        title: '영업시간 변경',
        back: main.operation,
    },
    [main.operation + '/holi_update']: {
        title: '휴무일 변경',
        back: main.operation + '/holi',
    },
    [main.menu]: {
        title: '메뉴 관리',
    },
    [main.order]: {
        title: '주문 상세 보기',
        back: 'goBack',
    },
    [main.order + '/reject']: {
        title: '주문 상세 보기',
        back: 'goBack',
    },
    [main.order + '/sticker']: {
        title: '문구 스티커 보기',
        back: 'goBack',
    },
    [main.order + '/progress']: {
        title: '주문 내역',
    },
    [main.order + '/complete']: {
        title: '주문 내역',
    },
    [main.order + '/cancel']: {
        title: '주문 내역',
    },
    [main.calculate]: {
        title: '배달 매출 현황',
    },
    [main.calculate + '/daily']: {
        title: '배달 매출 현황',
    },
    [main.calculate + '/monthly']: {
        title: '배달 매출 현황',
    },
    [main.calculate + '/yearly']: {
        title: '배달 매출 현황',
    },
    [main.support]: {
        title: '고객센터'
    },
    [main.support + '/notice']: {
        title: '고객센터'
    },
    [main.support + '/notice/view']: {
        title: '공지사항',
        back: main.support
    },
    [main.support + '/faq']: {
        title: '고객센터'
    },
    [main.support + '/qna']: {
        title: '고객센터'
    },
    [main.support + '/qna/write']: {
        title: '고객센터'
    },
    [main.policy]: {
        title: '개인정보 처리방침',
    },
    [main.policy + '/privacy']: {
        title: '개인정보 처리방침',
    },
    [main.policy + '/tos']: {
        title: '이용약관',
    },
    [main.notification]: {
        title: '알림',
        back:'goBack'
    },
};

/*
    로그인 후 관리자 메인 페이지.

    유저 정보를 갖고 있으며, 각각의 서브 페이지에 접근하여 유저 정보를 통해
    관리자 데이터(관리자 정보 관리, 메뉴 관리, 운영 정보 관리, 주문 목록, 매출, 서포트 관리)를
    CRUD 할 수 있게 함.
*/

let prevHeight = 0;

const MainPage = ({ location }) => {
    const reduxDispatch = useDispatch();
    const { title, back } = MobileTitleObject[location.pathname] ? MobileTitleObject[location.pathname] : { title: '오류 안내', back: 'goBack' };

    const user = useSelector(state => state.user);
    const [asideOpen, setAsideOpen] = useState(false);

    const mainRef = useRef(null);

    const callNoticeApi = useCallback(async () => {
        try {
            const res = await requestNotice();
            reduxDispatch(get_notice(res.notification));
        }
        catch (e) {
            alert(e);
        }
    }, [reduxDispatch]);

    const onScrollEvent = useCallback(e => {
        const { scrollTop } = e.target;
        const delta = prevHeight - scrollTop;
        if (scrollTop < 40) {
            reduxDispatch(setHeader(false));
        } else {
            if (delta > 10) {
                reduxDispatch(setHeader(false));
            } else if (delta < -20) {
                reduxDispatch(setHeader(true));
            }
        }
        prevHeight = scrollTop;
    }, [reduxDispatch]);

    useEffect(() => {
        if (isEmpty(user)) {
            const JWT_TOKEN = localStorage.getItem('user_token');
            if (JWT_TOKEN) {
                /* 토큰이 존재함 => 로그인 된 상태. */
                reduxDispatch(getUser(JWT_TOKEN));
                callNoticeApi();
            }
        }
    }, [user, reduxDispatch, callNoticeApi]);

    useEffect(() => {
        setAsideOpen(false);
        if (mainRef.current) {
            mainRef.current.scrollTo(0, 0);
        }
    }, [location]);

    return (
        <>
            <MobileHeader
                title={title} back={back}
                defaultIcon={(
                    <IconButton className={styles['hamburger']} onClick={() => setAsideOpen(true)}>
                        <img src={Hamburger} alt="메뉴 열기" />
                    </IconButton>
                )}
            />
            {!isEmpty(user) && <div className={styles['app']}>
                <Header />
                <Aside open={asideOpen} setOpen={setAsideOpen} />
                <article className={styles['main']} ref={mainRef} onScroll={onScrollEvent}>
                    <div className={styles['content']}>
                        <MainTitle pathname={location.pathname} />
                        <Switch>
                            <Route path={Paths.main.index} component={IntroPage} exact/>
                            <Route path={Paths.main.account + '/:modal?'} component={AccountPage} />
                            <Route path={Paths.main.secession} component={SecessionPage} />
                            <Route path={Paths.main.operation + '/:mode?'} component={OperationPage} />
                            <Route path={Paths.main.menu} component={MenuPage} />
                            <Route path={Paths.main.order + '/:tab?'} component={OrderPage} />
                            <Route path={Paths.main.calculate + '/:mode?'} component={CalculatePage} />
                            <Route path={Paths.main.support + '/:mode?/:modal?'} component={SupportPage} />
                            <Route path={Paths.main.policy +'/:mode?'} component={PolicyPage} />
                            <Route path={Paths.main.notification} component={NotificationPage} />
                            <Route component={ErrorPage} />
                        </Switch>
                    </div>
                </article>
            </div>}
        </>
    );
};

export default MainPage;
