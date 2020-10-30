import React, { useCallback, useRef } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import classNamesBind from 'classnames/bind';
// NPM Library
/* Library */

import { useSelector } from 'react-redux';
/* Redux */

import { Backdrop, ButtonBase,IconButton } from '@material-ui/core';
import BellImg from '../svg/notification-bell.svg';
/* Components */

import Paths from '../../paths';
/* Router Paths */

import styles from './Aside.module.scss';
// StyleSheets
import Direction from '../svg/Direction';
import Hamburger from '../svg/hamburger.svg';
import { useDialog } from '../../hooks/useDialog';
/* Statics */



const cn = classNamesBind.bind(styles);

/*
    관리자 메인 사이드 컴포넌트.

    관리자 메인 페이지에서 각 카테고리를 보여주고,
    이동할 수 있게 카테고리 링크 컴포넌트 리스트를 렌더링 함.
*/

/*
    왼쪽 사이드에 표시해야할 카테고리 컴포넌트

    카테고리의 정보를 가져오면 링크 컴포넌트를 연결시킨 후 렌더링 함
*/
const AsideCategory = ({ category }) => (
    <NavLink to={category.href}>
        <ButtonBase component="li" className={styles['item']}>{category.name}</ButtonBase>
    </NavLink>
);
const UserInfo = () => {
    /*
        사이드 바에서 유저 상태를 나타내 주는 컴포넌트

        유저 정보를 바탕으로 렌더링 함
    */
    const user = useSelector(state => state.user);
    const { name, confirm } = user;
    return (
        <ButtonBase component="div" className={cn('profile')}>
            <div className={cn('content')}>
                <h3 className={cn('name')}>
                    <span>{name}</span>
                    <Direction vector={'RIGHT'} />
                </h3>
                <p className={cn('label')}>
                    {confirm === 1 ? <><b>{name} 점장님</b> 반갑습니다!</>
                    : confirm === 0 ? '사용 승인 대기 중입니다.' : '이용 정지 상태입니다.'}
                </p>
            </div>
        </ButtonBase>
    );
};

const Aside = ({ open, setOpen }) => {
    /*
        Desktop 화면에서 보여줄 사이드 컴포넌트
    */
    const history = useHistory();
    const openDialog = useDialog();

    const onClickLogout = useCallback(() => {
        setOpen(false);
        openDialog("정말 로그아웃 하시겠습니까?", '', () => history.push(Paths.main.logout), true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const navCategories = useRef([
        { name: '운영 정보 관리', href: Paths.main.operation },
        { name: '메뉴 관리', href: Paths.main.menu },
        { name: '주문 목록', href: Paths.main.order },
        { name: '배달 매출 현황', href: Paths.main.calculate },
        { name: '고객센터', href: Paths.main.support },
        { name: '약관 및 정책', href: Paths.main.policy },
    ]);

    return (
        <>
            <aside className={cn('aside', { open })}>
                <ButtonBase
                    className={styles['tablet-nav-button']}
                    onClick={() => setOpen(!open)}
                >
                    <img
                        className={styles['hamburger']}
                        src={Hamburger}
                        alt="hamburder"
                    />
                </ButtonBase>
                <nav className={cn('content')}>
                    <Link to={Paths.main.account}>
                        <UserInfo />
                    </Link>
                    <IconButton
                        className={styles['notification-bell']}
                        onClick={(e) => {
                            e.stopPropagation();
                            history.push(Paths.main.notification);
                        }}
                    >
                        <img src={BellImg} alt="bell" />
                    </IconButton>
                    <div className={cn('category')}>
                        <ul className={cn('list')}>
                            {navCategories.current.map((category) => (
                                <AsideCategory
                                    key={category.name}
                                    category={category}
                                />
                            ))}
                        </ul>
                    </div>
                </nav>
                <ButtonBase
                    className={styles['button']}
                    onClick={onClickLogout}
                >
                    로그아웃
                </ButtonBase>
            </aside>
            <Backdrop
                className={styles['backdrop']}
                open={open}
                onClick={() => setOpen(false)}
            />
        </>
    );
};

export default Aside;
