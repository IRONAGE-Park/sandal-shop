/* global daum */
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import classnames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import AccountInput from '../../components/main/account/AccountInput';
import { secondsToMMSS, stringToTel } from '../../lib/formatter';

import styles from './AccountContainer.module.scss';
import { ButtonBase, IconButton } from '@material-ui/core';
import Paths from '../../paths';
import { useStore } from '../../hooks/useStore';
import { useDialog } from '../../hooks/useDialog';

import RemoveIcon from '../../components/svg/remove.svg';
import { requestPUTUpdateAddress, requestPUTUpdateName, requestPUTUpdatePassword, requestPUTUpdatePhoneNumber, requestPUTUpdateShop } from '../../api/mypage';
import { updateUser } from '../../store/user';
import { isCellPhoneForm, isPasswordForm } from '../../lib/formatChecker';
import { requestPOSTCheckPhoneAuth, requestPOSTReceivePhoneAuth } from '../../api/auth';
import { requestGETLocation } from '../../api/address';

const cn = classnames.bind(styles);

const AUTH_NUMBER_SIZE = 6;

const AccountPossible = ({ possible, text }) => (
    <ButtonBase className={cn('possible-box', { possible })}>
        {text}
    </ButtonBase>
);

export const Timer = ({ timer, setTimer, setAuthState }) => {
    const openDialog = useDialog();
    useEffect(() => {
        const timeout = setTimeout(() => {
            setTimer(timer - 1);
            if (timer - 1 < 0) {
                openDialog('인증 제한 시간이 초과되었습니다.', '다시 시도해주세요!');
                setAuthState(0);
            }
        }, 1000);
        return () => clearTimeout(timeout);
    }, [openDialog, setAuthState, setTimer, timer]);

    return <p className={cn('timer')}>{secondsToMMSS(timer)}</p>;
};

const AccountLabelInput = ({ value, onChange, label, response }) => (
    <div className={cn('label-box', { response })}>
        {response && <p className={styles['label']}>{label}</p>}
        <input
            className={cn('input', 'normal', 'desktop')}
            type="password"
            onChange={onChange}
            value={value}
            placeholder={label}
        />
        <input
            className={cn('input', 'normal', 'mobile')}
            type="password"
            onChange={onChange}
            value={value}
        />
    </div>
);

const AccountPhoneInput = ({
    value,
    onChange,
    buttonName,
    onClick,
    placeholder,
    children,
    inputDisabled,
    buttonDisabled,
    buttonEnabled,
    reference
}) => {
    return (
        <div className={styles['phone-box']}>
            <input ref={reference} className={cn('input', 'normal', 'phone')} type="number" value={value} onChange={onChange} placeholder={placeholder} disabled={inputDisabled}/>
            <ButtonBase onClick={onClick} className={cn('phone-button', { enabled: buttonEnabled, disabled: buttonDisabled })} disabled={buttonDisabled} disableRipple={buttonDisabled}>
                {buttonName}
            </ButtonBase>
            {children}
        </div>
    )
};

const AccountContainer = ({ modal }) => {
    const USER_TOKEN = useStore();
    const history = useHistory();
    const reduxDispatch = useDispatch();
    const openDialog = useDialog();
    const user = useSelector(state => state.user);
    
    const [userState, userDispatch] = useReducer((state, action) => ({
        ...state, ...action
    }), {
        shop_name: '', name: '',
        passwordOld: '', password: '', passwordConfirm: '',
        phoneNumber: '', authNumber: '',
        address: '', detailAddress: '',
        post_num: '', shop_lat: '', shop_lng: ''
    });

    const passwordInputRef = useRef(null);
    const phoneInputRef = useRef(null);
    const authInputRef = useRef(null);
    const addressDetailInputRef = useRef(null);

    const { phoneNumber, authNumber } = userState;
    const [passwordCheck, setPasswordCheck] = useState(false);
    const [authState, setAuthState] = useState(0); // 현재 인증 상태
    // 0: 인증 메세지 보내기 전
    // 1: 인증 메세지 보냄
    // 2: 인증 완료
    const [phoneAuth, setPhoneAuth] = useState(false);

    const onChangeShop = useCallback(e => userDispatch({ shop_name: e.target.value }), []);
    const onChangeName = useCallback(e => userDispatch({ name: e.target.value }), []);
    const onChangePasswordOld = useCallback(e => userDispatch({ passwordOld: e.target.value }), []);
    const onChangePassword = useCallback(e => userDispatch({ password: e.target.value }), []);
    const onChangePasswordConfirm = useCallback(e => userDispatch({ passwordConfirm: e.target.value }), []);
    const onChangePhoneNumber = useCallback(e => userDispatch({ phoneNumber: e.target.value }), []);
    const onChangeAuthNumber = useCallback(e => userDispatch({ authNumber: e.target.value }), []);
    const onChangeAddress = useCallback(e => userDispatch({ address: e.target.value }), []);
    const onChangeDetailAddress = useCallback(e => userDispatch({ detailAddress: e.target.value }), []);
    const onRemoveValue = useCallback(name => userDispatch({ [name]: '' }), []);
    const addrDispatch = useCallback(obj => userDispatch(obj), []);
    const [isAddressSearch, setIsAddressSearch] = useState(false); // 주소 검색을 한 적이 있으면 인풋 고정.

    const [timer, setTimer] = useState(0); // 인증 시간(180 초)

    const onSearchAddress = useCallback(() => {
        /* 주소를 선택 창을 띄움 */
        const themeObj = {
            searchBgColor: '#007246', //검색창 배경색
            queryTextColor: '#FFFFFF', //검색창 글자색
            emphTextColor: '#008726', //강조 글자색
            outlineColor: '#EBEBEB', //테두리
        };
        new daum.Postcode({
            oncomplete: ({ roadAddress, zonecode }) => {
                try {
                    // const res = await requestGetLocationByAddress(roadAddress);
                    requestGETLocation(roadAddress, result => {
                        addrDispatch({
                            address: roadAddress,
                            post_num: zonecode,
                            shop_lat: result[0].y,
                            shop_lng: result[0].x
                        });
                    });
                    addressDetailInputRef.current.focus();
                } catch (e) {
                    openDialog('주소 검색에 실패했습니다.', '잠시 후에 다시 시도해 주세요.')
                }
                setIsAddressSearch(true);
            },
            popupName: '가맹점 주소 검색',
            animation: true,
            theme: themeObj,
        }).open({ q: !isAddressSearch && userState.address });
    }, [isAddressSearch, userState.address, addrDispatch, openDialog]);
    
    const onAuthSend = useCallback(async () => {
        /* 인증번호 발송 버튼을 누름 */
        if (isCellPhoneForm(phoneNumber)) {
            try {
                const res = await requestPOSTReceivePhoneAuth({ pv_hp: phoneNumber });
                if (res.data.msg === '실패!') {
                    alert('SMS not enough point. please charge.');
                } else {
                    setTimer(3 * 60); // 3분
                    setAuthState(1); // 인증 메세지 보냄 상태로 변경
                    openDialog('인증번호가 성공적으로 발송되었습니다!', '인증번호를 확인 후 입력해 주세요!', () => authInputRef.current.focus());
                }
            } catch (e) {
                openDialog('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
                history.replace(Paths.auth.index);
            }
        } else {
            openDialog('휴대폰 형식에 맞지 않습니다!', '휴대폰 번호를 확인해 주세요.', () => phoneInputRef.current.focus());
        }
    }, [phoneNumber, openDialog, history]);

    const onAuthReSend = useCallback(() => 
        /* 인증번호 재발송 버튼을 누름 */
        openDialog(
            '인증번호를 재전송 하시겠습니까?',
            `인증번호는 ${AUTH_NUMBER_SIZE}자리 입니다.`,
            () => {
                setAuthState(0);
                onAuthSend();
                authInputRef.current.focus();
            }
        )
    , [openDialog, onAuthSend]);

    const onAuthCheck = useCallback(async () => {
        /* 인증하기 버튼 누름 */
        try {
            const res = await requestPOSTCheckPhoneAuth({ pv_hp: phoneNumber, pv_vnum: authNumber });
            if (res.data.msg === '성공!') {
                openDialog('성공적으로 인증되었습니다!', '다음 절차를 진행해 주세요!');
                setPhoneAuth(true);
                setAuthState(2);
            } else if (res.data.msg === '유효하지 않는 인중번호 입니다. 인증번호를 재발송 해주세요.') {
                openDialog('유효하지 않는 인증번호입니다.', '인증번호를 재발송해 주세요.');
            } else {
                openDialog('인증번호가 틀렸습니다!', '인증번호를 다시 한 번 확인해 주세요!', authInputRef.current.focus());
            }
        } catch (e) {
            openDialog('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
            history.replace(Paths.auth.index);
        }
    }, [phoneNumber, authNumber, openDialog, setPhoneAuth, setAuthState, history]);

    const callUpdateShop = useCallback(async () => {
        const { shop_name } = userState;
        if (shop_name) {
            try {
                const res = await requestPUTUpdateShop(USER_TOKEN, shop_name);
                if (res.data.msg === "성공") {
                    openDialog("성공적으로 변경되었습니다!", '');
                    reduxDispatch(updateUser('shop_name', shop_name));
                } else {
                    openDialog('잘못된 접근입니다.', '잠시 후 다시 시도해 주세요.');
                }
            } catch (e) {
                openDialog('내 정보 변경 도중 오류가 발생했습니다.', '잠시 후 다시 시도해 주세요.');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [USER_TOKEN, userState, openDialog]);
    const callUpdateName = useCallback(async () => {
        const { name } = userState;
        if (user.name !== name) {
            try {
                const res = await requestPUTUpdateName(USER_TOKEN, name);
                if (res.data.msg === "성공") {
                    openDialog("성공적으로 변경되었습니다!", "");
                    reduxDispatch(updateUser('name', name));
                } else {
                    openDialog('잘못된 접근입니다.', '잠시 후 다시 시도해 주세요.');
                }
            } catch (e) {
                openDialog('내 정보 변경 도중 오류가 발생했습니다.', '잠시 후 다시 시도해 주세요.');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [USER_TOKEN, user, userState, openDialog]);
    const callUpdatePhoneNumber = useCallback(async () => {
        if (phoneAuth) {
            const { phoneNumber } = userState;
            if (user.hp !== phoneNumber) {
                try {
                    const res = await requestPUTUpdatePhoneNumber(USER_TOKEN, phoneNumber);
                    if (res.data.msg === "성공") {
                        openDialog("성공적으로 변경되었습니다!", "");
                        reduxDispatch(updateUser('hp', phoneNumber));
                    } else {
                        openDialog('잘못된 접근입니다.', '잠시 후 다시 시도해 주세요.');
                    }
                } catch (e) {
                    openDialog('내 정보 변경 도중 오류가 발생했습니다.', '잠시 후 다시 시도해 주세요.');
                }
            } else {
                openDialog("변경 전과 정보가 같습니다.");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [USER_TOKEN, user, userState, phoneAuth, openDialog]);
    const callUpdatePassword = useCallback(async () => {
        if (passwordCheck) {
            const { passwordOld, password, passwordConfirm } = userState;
            if (isPasswordForm(password)) {
                try {
                    const res = await requestPUTUpdatePassword(USER_TOKEN, passwordOld, password, passwordConfirm);
                    if (res.data.msg === "성공") {
                        openDialog("성공적으로 변경되었습니다!", "");
                    } else {
                        openDialog('내 정보 변경 도중 오류가 발생했습니다.', '잠시 후 다시 시도해 주세요.');
                    }
                } catch (e) {
                    openDialog('현재 비밀번호가 일치하지 않습니다.', '비밀번호를 다시 한 번 확인해 주세요.', () => passwordInputRef.current.focus());
                }
            } else {
                openDialog("비밀번호 형식에 맞지 않습니다!", '8자 이상으로 문자, 숫자 및 특수문자가 모두 포함되어야 합니다.', () => passwordInputRef.current.focus());
            }
        }
    }, [USER_TOKEN, userState, passwordCheck, openDialog]);
    const callUpdateAddress = useCallback(async () => {
        const {
            address, detailAddress,
            post_num, shop_lat, shop_lng
        } = userState;
        if (address && detailAddress && post_num && shop_lat && shop_lng) {
            try {
                const res = await requestPUTUpdateAddress(USER_TOKEN, post_num, address, detailAddress, shop_lat, shop_lng);
                if (res.data.msg === "성공") {
                    openDialog("성공적으로 변경되었습니다!", "");
                } else {
                    openDialog('내 정보 변경 도중 오류가 발생했습니다.', '잠시 후 다시 시도해 주세요.');
                }
            } catch (e) {
                openDialog('내 정보 변경 도중 오류가 발생했습니다.', '잠시 후 다시 시도해 주세요.');
            }
        } else {
            openDialog("주소가 검색되지 않았습니다.");
        }
    }, [userState, USER_TOKEN, openDialog]);
    const onClickUpdate = useCallback(async () => {
        callUpdateShop();
        callUpdateName();
        callUpdatePhoneNumber();
        callUpdatePassword();
        callUpdateAddress();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callUpdateName, callUpdatePassword, callUpdatePhoneNumber, callUpdateShop, callUpdateAddress]);


    const onKeyDown = useCallback((e, callBack) => {
        if (e.key === 'Enter') {
            callBack();
        }
    }, []);

    useEffect(() => {
        const { password, passwordConfirm } = userState;
        setPasswordCheck(
            password === passwordConfirm &&
            userState.password.length &&
            userState.passwordConfirm.length
        );
    }, [userState]);

    useEffect(() => {
        const { name, shop_name } = user;
        const sn = shop_name ? shop_name : '';
        userDispatch({ name, shop_name: sn });
    }, [user]);

    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                <div className={styles['area']}>
                    <AccountInput title="가맹점명" text={user.shop_name} handleClick={callUpdateShop} possible
                    modal={modal === 'modal'}>
                        <div className={styles['relative']}>
                            <input
                                className={cn('input', 'normal')}
                                type="text"
                                onChange={onChangeShop}
                                value={userState.shop_name}
                                onKeyDown={e => onKeyDown(e, callUpdateShop)}
                            />
                            <IconButton onClick={() => onRemoveValue('shop_name')} className={cn('remove-button')}>
                                <img src={RemoveIcon} alt="remove" />
                            </IconButton>
                        </div>
                    </AccountInput>
                    <AccountInput title="이름" text={user.name} handleClick={callUpdateName} possible
                    modal={modal === 'modal'}>
                        <div className={styles['relative']}>
                            <input
                                className={cn('input', 'normal')}
                                type="text"
                                onChange={onChangeName}
                                value={userState.name}
                                onKeyDown={e => onKeyDown(e, callUpdateName)}
                            />
                            <IconButton onClick={() => onRemoveValue('name')} className={cn('remove-button')}>
                                <img src={RemoveIcon} alt="remove" />
                            </IconButton>
                        </div>
                    </AccountInput>
                    <AccountInput title="이메일" text={user.email} />
                </div>
                <div className={styles['area']}>
                    <AccountInput
                        title="비밀번호"
                        text=""
                        possible={passwordCheck}
                        handleClick={callUpdatePassword}
                        modal={modal === 'modal'}>
                        <div>
                            <AccountLabelInput
                                onChange={onChangePasswordOld}
                                value={userState.passwordOld}
                                label="현재 비밀번호"
                                response
                            />
                            <AccountLabelInput
                                onChange={onChangePassword}
                                value={userState.password}
                                label="새 비밀번호"
                                response
                            />
                            <AccountLabelInput
                                onChange={onChangePasswordConfirm}
                                value={userState.passwordConfirm}
                                label="새 비밀번호 확인"
                            />
                            <p
                                className={cn('password-check', {
                                    confirm: passwordCheck,
                                    on:
                                        userState.password.length &&
                                        userState.passwordConfirm.length,
                                })}
                            >
                                {passwordCheck
                                    ? '비밀번호가 일치합니다.'
                                    : '비밀번호가 일치하지 않습니다.'}
                            </p>
                            <AccountPossible
                                text="비밀번호 변경 확인"
                                possible={passwordCheck}
                            />
                        </div>
                    </AccountInput>
                </div>
                <div className={styles['area']}>
                    <AccountInput
                        title="휴대폰 번호"
                        text={stringToTel(user.hp)}
                        hadleClick={callUpdatePhoneNumber}
                        possible={phoneAuth}
                        modal={modal === 'modal'}>
                        <div>
                            <AccountPhoneInput
                                value={userState.phoneNumber}
                                onChange={onChangePhoneNumber}
                                placeholder="휴대폰 번호 인증"
                                buttonName={authState === 0 ? '인증번호 발송' : authState === 1 ? "인증번호 재발송": "인증 완료"}
                                onClick={authState === 0 ? onAuthSend : authState === 1 ? onAuthReSend : () => {}}
                                buttonEnabled={userState.phoneNumber.length !== 0}
                                reference={phoneInputRef}
                            />
                            <AccountPhoneInput
                                value={userState.authNumber}
                                onChange={onChangeAuthNumber}
                                onClick={authState === 1 ? onAuthCheck : () => {}}
                                buttonName={'인증하기'}
                                reference={authInputRef}
                            >
                                {authState === 1 && <Timer timer={timer} setTimer={setTimer} setAuthState={setAuthState} />}
                            </AccountPhoneInput>
                            <AccountPossible
                                text="휴대폰 번호 변경 확인"
                                possible={phoneAuth}
                            />
                        </div>
                    </AccountInput>
                </div>
                <div className={styles['area']}>
                    <AccountInput title="가맹점 주소" text={''}
                        handleClick={callUpdateAddress}
                        possible
                        modal={modal === 'modal'}>
                        <div>
                            <div className={styles['address-box']}>
                                <div className={cn('address-area', 'i')}>
                                    <input
                                        className={cn('input', 'address')}
                                        type="text"
                                        onChange={onChangeAddress}
                                        value={userState.address}
                                        onKeyDown={e => onKeyDown(e, onSearchAddress)}
                                        
                                    />
                                </div>
                                <div className={cn('address-area', 'b')}>
                                    <ButtonBase
                                        onClick={onSearchAddress}
                                        className={styles['address-button']}
                                    >
                                        주소 찾기
                                    </ButtonBase>
                                </div>
                            </div>
                            <div className={styles['address-box']}>
                                <input
                                    className={cn('input', 'detail-address')}
                                    type="text"
                                    onChange={onChangeDetailAddress}
                                    onKeyDown={e => onKeyDown(e, callUpdateAddress)}
                                    value={userState.detailAddress}
                                    placeholder="상세 주소를 입력하세요."
                                    ref={addressDetailInputRef}
                                />
                            </div>
                        </div>
                    </AccountInput>
                </div>
                <div className={styles['secession']}>
                    <Link
                        className={styles['secession-link']}
                        to={Paths.main.secession}
                    >
                        <span className={styles['desktop-link']}>
                            회원 탈퇴
                        </span>
                        <ButtonBase className={styles['mobile-link']}>
                            회원 탈퇴
                        </ButtonBase>
                    </Link>
                </div>
                <div className={styles['update']}>
                    <ButtonBase className={styles['update-button']} onClick={onClickUpdate}>
                        내 정보 수정
                    </ButtonBase>
                </div>
            </div>
        </div>
    );
};

export default AccountContainer;