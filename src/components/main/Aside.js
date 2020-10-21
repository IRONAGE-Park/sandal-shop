import React, { useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import classNamesBind from 'classnames/bind';
// NPM Library
/* Library */

import { useSelector } from 'react-redux';
/* Redux */

import { Backdrop, ButtonBase } from '@material-ui/core';
/* Components */

import Paths from '../../paths';
/* Router Paths */

import styles from './Aside.module.scss';
// StyleSheets
import Direction from '../svg/Direction';
import Hamburger from '../svg/hamburger.svg';
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
    const { name, level } = user;
    return (
        <ButtonBase component="div" className={cn('profile')}>
            <div className={cn('content')}>
                <h3 className={cn('name')}>
                    <span>{name}</span>
                    <Direction vector={'RIGHT'} />
                </h3>
                <p className={cn('label')}>
                    {level ? <><b>{name} 점장님</b> 반갑습니다!</>
                    : '사용 승인 대기 중입니다.'}
                </p>
            </div>
        </ButtonBase>
    );
};

const Aside = ({ open, setOpen }) => {
    /*
        Desktop 화면에서 보여줄 사이드 컴포넌트
    */
    const navCategories = useRef([
        { name: '운영 정보 관리', href: Paths.main.operation },
        { name: '메뉴 관리', href: Paths.main.menu },
        { name: '주문 목록', href: Paths.main.order },
        { name: '배달 매출 현황', href: Paths.main.calculate.days },
        { name: '공지사항', href: Paths.main.support.notice },
        { name: '자주 묻는 질문', href: Paths.main.support.faq },
        { name: '1:1 문의', href: Paths.main.support.qna },
    ]);

    return (
        <>
            <aside className={cn('aside', { open })}>
                <ButtonBase className={styles['tablet-nav-button']} onClick={() => setOpen(!open)}>
                    <img className={styles['hamburger']} src={Hamburger} alt="hamburder" />
                </ButtonBase>
                <nav className={cn('content')}>
                    <Link to={Paths.main.account}>
                        <UserInfo />
                    </Link>
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
                <Link to={Paths.main.logout} className={styles['logout']}>
                    <ButtonBase component="div" className={styles['button']}>
                        로그아웃
                    </ButtonBase>
                </Link>
            </aside>
            <Backdrop className={styles['backdrop']} open={open} onClick={() => setOpen(false)} />
        </>
    );
};

export default Aside;
