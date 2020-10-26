import React from 'react';
import Paths from '../../../paths';
/* Library */

import styles from './MainTitle.module.scss';
// StyleSheets
/* Statics */

/*
    관리자 메인 페이지 상단 제목 컴포넌트.

    URL을 확인하여 현재 URL에 맞는
    메인 Content 부분의 제목을 렌더링함.
*/

const { main } = Paths;

const MainTitleObject = {
    [main.index]: '샌달 가맹점 관리',
    [main.account]: '내 정보 수정',
    [main.account + '/modal']: '내 정보 수정',
    [main.secession]: '회원 탈퇴',
    [main.operation]: '운영 정보 관리',
    [main.operation + '/time']: '운영 정보 관리',
    [main.operation + '/time_update']: '운영 정보 관리',
    [main.operation + '/holi']: '운영 정보 관리',
    [main.operation + '/holi_update']: '운영 정보 관리',
    [main.menu]: '메뉴 관리',
    [main.order]: '주문 상세 보기',
    [main.order + '/reject']: '주문 상세 보기',
    [main.order + '/sticker']: '주문 상세 보기',
    [main.order + '/progress']: '주문 목록',
    [main.order + '/complete']: '주문 목록',
    [main.order + '/cancel']: '주문 목록',
    [main.calculate]: '배달 매출 현황',
    [main.calculate + '/daily']: '배달 매출 현황',
    [main.calculate + '/monthly']: '배달 매출 현황',
    [main.calculate + '/yearly']: '배달 매출 현황',
    [main.policy]: '약관 및 정책',
    [main.policy + '/privacy']: '약관 및 정책',
    [main.policy + '/tos']: '약관 및 정책',
    [main.support]: '고객센터',
    [main.support + '/notice']: '고객센터',
    [main.support + '/faq']: '고객센터',
    [main.support + '/qna']: '고객센터',
};

const MainTitle = ({ pathname }) => {
    /* 
        페이지마다 변경되는 메인 페이지 상단 제목 컴포넌트.
        title을 props로 받아오면 그대로 렌더링해 줌.
    */
   const title = MainTitleObject[pathname] ? MainTitleObject[pathname] : "";
    return (
        <div className={styles['title']}>
            <h2 className={styles['content']}>{title}</h2>
        </div>
    );
};

export default MainTitle;