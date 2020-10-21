import React from 'react';
/* Library */

import Paths from '../../../paths';
/* Custom Library */

import FindItem from './FindItem';
/* Components */

import styles from './Find.module.scss';
/* Stylesheets */

import FindIdSvg from '../../svg/auth/find_id.svg';
import FindPwSvg from '../../svg/auth/find_pw.svg';
/* Statics */

const ID_TEXT = (
    <>
        <span className={styles['division']}>휴대폰 인증을 통해 </span>
        <span className={styles['division']}>아이디를 찾습니다.</span>
    </>
);
const PW_TEXT = (
    <span>자신의 아이디와 휴대폰 인증을 통해 비밀번호를 재설정합니다.</span>
);

export default () => (
    <>
        <FindItem
            src={FindIdSvg}
            title="아이디 찾기"
            text={ID_TEXT}
            href={Paths.auth.find.id}
        />
        <FindItem
            src={FindPwSvg}
            title="비밀번호 찾기"
            text={PW_TEXT}
            href={Paths.auth.find.pw}
        />
    </>
);
