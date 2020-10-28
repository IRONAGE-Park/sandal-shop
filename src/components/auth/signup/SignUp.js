/* global daum */
import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames/bind';
/* Library */


import { requestPOSTLogin } from '../../../api/auth';
/* API */

import { ButtonBase } from '@material-ui/core';
import AgreeModal from '../../modal/AgreeModal';
import AuthInput from '../AuthInput';
import PasswordAuth from '../PasswordAuth';
import PhoneAuth from '../PhoneAuth';
import Checkbox from '../Checkbox';
import CheckboxList from '../CheckboxList';
/* Components */

import { useDialog } from '../../../hooks/useDialog';
/* Hooks */

import styles from './SignUp.module.scss';
import { isEmailForm } from '../../../lib/formatChecker';
import {
    requestGETLocation
} from '../../../api/address';
import { useHistory } from 'react-router-dom';
import Paths from '../../../paths';
/* Stylesheets */

const cn = classnames.bind(styles);

export default ({
    shop, setShop,
    name, setName,
    password, setPassword,
    email, setEmail,
    phone, setPhone,
    addrState, addrDispatch,
    setActiveConfirm,
    modal
}) => {
    const openDialog = useDialog();
    const history = useHistory();
    const [agreeTitle, setAgreeTitle] = useState(''); // 동의 모달
    const [emailOverlap, setEmailOverlap] = useState(false); // 이메일 중복 여부
    const [passwordCheck, setPasswordCheck] = useState(false); // 비밀번호/확인 일치 여부
    const [phoneAuth, setPhoneAuth] = useState(false); // 휴대폰 인증 여부
    const [allChecked, setAllChecked] = useState(false); // 전체 동의
    const [isAddressSearch, setIsAddressSearch] = useState(false); // 주소 검색을 한 적이 있으면 인풋 고정.
    const { addr, detail_addr, post_num } = addrState;
    
    const onOpenModal = useCallback(title => {
        setAgreeTitle(title);
        history.push(Paths.auth.signup + '/agree');
    }, [history]);
    const onCloseModal = useCallback(() => history.goBack(), [history]);

    const [checkList, setCheckList] = useState([
        { id: 1, title: '개인정보처리방침 필수 동의', detail: () => onOpenModal('개인정보처리방침'), checked: false },
        { id: 2, title: '이용약관 필수 동의', detail: () => onOpenModal('이용약관'), checked: false },
        { id: 3, title: '이벤트 알림 선택 동의', text: 'SMS, 이메일을 통해 할인/이벤트/쿠폰 정보를 받아보실 수 있습니다.', checked: false },
    ]); // 동의 요소 리스트

    const onSearchAddress = useCallback(() => {
        /* 주소를 선택 창을 띄움 */
        const themeObj = {
            searchBgColor: '#007246', //검색창 배경색
            queryTextColor: '#FFFFFF', //검색창 글자색
            emphTextColor: '#008726', //강조 글자색
            outlineColor: '#EBEBEB', //테두리
        };
        new daum.Postcode({
            oncomplete: async ({ roadAddress, zonecode }) => {
                try {
                    requestGETLocation(roadAddress, result => {
                        addrDispatch({
                            addr: roadAddress,
                            post_num: zonecode,
                            shop_lat: result[0].y,
                            shop_lng: result[0].x
                        });
                    });
                } catch (e) {
                    openDialog('주소 검색에 실패했습니다.', '잠시 후에 다시 시도해 주세요.')
                }
                setIsAddressSearch(true);
            },
            popupName: '가맹점 주소 검색',
            animation: true,
            theme: themeObj,
        }).open({ q: !isAddressSearch && addr });
    }, [isAddressSearch, addr, addrDispatch, openDialog]);
    const onChangePassword = useCallback((e) => setPassword(e.target.value), [setPassword]);
    const onChangeAddress = useCallback(e => addrDispatch({ [e.target.name]:  e.target.value }), [addrDispatch]);
    const onToggleAllAgree = useCallback(() =>
        /* 전체 선택을 클릭하면 모든 체크박스 리스트의 값을 변경함. */
        setCheckList((list) =>
            list.map((item) => ({ ...item, checked: !allChecked })),
        ), [setCheckList, allChecked]);
    const onToggleAgree = useCallback(id =>
        /* 각 개별로 클릭하면 그 체크박스의 값을 변경함. */
        setCheckList((list) =>
            list.map((item) =>
                item.id === id ? { ...item, checked: !item.checked } : item,
            ),
        ), [setCheckList]);
    const onClickEmailOverlapCheck = useCallback(async () => {
        /* 이메일 중복 검사를 하는 함수. */
        if (isEmailForm(email)) {
            try {
                const res = await requestPOSTLogin({ email });
                if (res.data.msg === '비밀번호가 틀렸습니다.') {
                    openDialog(
                        '중복된 이메일입니다.',
                        '다른 이메일로 시도해 주세요.',
                    );
                } else if (res.data.msg === '가맹점 계정이 아닙니다. 가맹점 계정으로 로그인 하시거나 가맹점 회원가입으로 새로 진행해주세요.') {
                    openDialog("가맹점 계정이 아닙니다.", "유저 계정과 다른 새로운 가맹점 계정을 생성해 주세요.")
                } else if (res.data.msg === '탈퇴한 이메일입니다.') {
                    openDialog(res.data.msg, '다른 이메일로 시도해 주세요.');
                } else {
                    openDialog(
                        '사용 가능한 이메일입니다.',
                        '다음 절차를 계속하세요.',
                    );
                    setEmailOverlap(true);
                }
            } catch (e) {
                openDialog(
                    '서버에 오류가 발생하였습니다.',
                    '잠시 후 다시 시도해 주세요.',
                );
            }
        } else {
            openDialog(
                '잘못된 이메일 형식입니다.',
                '이메일 형식을 확인해 주세요.',
            );
        }
    }, [email, openDialog, setEmailOverlap]);

    useEffect(() => setEmailOverlap(false), [email]); // 중복 체크를 완료하더라도 이메일이 변경되면 중복 검사 다시 하도록 설정
    useEffect(() => {
        /* 전체 선택을 checked 할지 말지 결정하는 함수. */
        const result = checkList.findIndex((item) => !item.checked);
        setAllChecked(result === -1);
    }, [checkList]);
    useEffect(() =>
        /* 가입 완료 버튼을 활성화 시킬지 말지 결정하는 함수. */
        setActiveConfirm(
            shop !== '' && email !== '' // 가맹점 명과 이메일이 공란이 아니면,
            && emailOverlap && passwordCheck && phoneAuth // 중복 검사, 비밀번호 일치, 휴대폰 인증 여부
            && addr !== '' && detail_addr !== '' && post_num // 주소의 내용이 입력.
            && checkList[0].checked && checkList[1].checked// 필수 동의 요소가 선택.
        ),
    [shop, email, addr, detail_addr, post_num, setActiveConfirm, emailOverlap, passwordCheck, phoneAuth, checkList])
    /* LifeCycle */

    return (
        <form className={styles['signup-form']}>
            <div className={styles['area']}>
                <div className={styles['content']}>
                    <h3 className={cn('title')}>정보를 입력해 주세요.</h3>
                </div>
            </div>
            <div className={cn('area', 'domain', 'shop')}>
                <div className={cn('content')}>
                    <AuthInput
                        type="text"
                        name="shop"
                        handleChange={e => setShop(e.target.value)}
                        value={shop}
                        label="가맹점 명"
                    />
                </div>
            </div>
            <div className={cn('area', 'domain', 'name')}>
                <div className={cn('content')}>
                    <AuthInput
                        type="text"
                        name="name"
                        handleChange={e => setName(e.target.value)}
                        value={name}
                        label="점주 성함"
                    />
                </div>
            </div>
            <div className={cn('area', 'domain', 'email')}>
                <div className={cn('content')}>
                    <AuthInput
                        type="email"
                        name="email"
                        handleChange={(e) => setEmail(e.target.value)}
                        value={email}
                        label="이메일"
                    >
                        <ButtonBase
                            className={cn('interaction', 'button', {
                                active: email !== '' && !emailOverlap,
                            })}
                            disableRipple={email === '' || emailOverlap}
                            onClick={
                                email !== '' && !emailOverlap
                                    ? onClickEmailOverlapCheck
                                    : () => {}
                            }
                        >
                            {emailOverlap ? '중복 검사 완료' : '중복 검사'}
                        </ButtonBase>
                    </AuthInput>
                </div>
            </div>
            <div className={cn('area', 'domain', 'password')}>
                <div className={cn('content')}>
                    <PasswordAuth
                        value={password}
                        handleChange={onChangePassword}
                        setSame={setPasswordCheck}
                    />
                </div>
            </div>
            <div className={cn('area', 'domain', 'phone')}>
                <div className={cn('content')}>
                    <PhoneAuth phone={phone} setPhone={setPhone} setAuth={setPhoneAuth} />
                </div>
            </div>
            <div className={cn('area', 'domain', 'address')}>
                <div className={cn('content')}>
                    <AuthInput
                        type="text"
                        name="addr"
                        handleChange={onChangeAddress}
                        value={addr}
                        label="가맹점 주소"
                        readOnly={isAddressSearch}
                    >
                        <ButtonBase
                            className={cn('interaction', 'button', 'small')}
                            onClick={onSearchAddress}
                        >
                            주소 찾기
                        </ButtonBase>
                    </AuthInput>
                    <input
                        type="text"
                        name="detail_addr"
                        className={cn('interaction')}
                        onChange={onChangeAddress}
                        value={detail_addr}
                        placeholder="상세 주소를 입력하세요."
                    />
                </div>
            </div>
            <div className={cn('agree')}>
                <div className={cn('all', 'content')}>
                    <div className={cn('mobile', 'content')}>
                        <Checkbox
                            checked={allChecked}
                            handleToggle={onToggleAllAgree}
                            title="모두 동의합니다."
                            bold
                        />
                    </div>
                </div>
                <div className={cn('list', 'content')}>
                    <div className={cn('mobile', 'content')}>
                        <CheckboxList
                            checkedList={checkList}
                            handleListToggle={onToggleAgree}
                        />
                    </div>
                </div>
            </div>
            <AgreeModal
                title={agreeTitle}
                open={modal === 'agree'}
                handleClose={onCloseModal}
            />
        </form>
    );
};
