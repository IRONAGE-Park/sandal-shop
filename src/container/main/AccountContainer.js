import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import classnames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import AccountInput from '../../components/main/account/AccountInput';
import { stringToTel } from '../../lib/formatter';

import styles from './AccountContainer.module.scss';
import { ButtonBase, IconButton } from '@material-ui/core';
import Paths from '../../paths';
import { useStore } from '../../hooks/useStore';
import { useDialog } from '../../hooks/useDialog';

import RemoveIcon from '../../components/svg/remove.svg';
import { requestPUTUpdateName, requestPUTUpdatePassword, requestPUTUpdatePhoneNumber, requestPUTUpdateShop } from '../../api/mypage';
import { updateUser } from '../../store/user';

const cn = classnames.bind(styles);

const AccountPossible = ({ possible, text }) => (
    <ButtonBase className={cn('possible-box', { possible })}>
        {text}
    </ButtonBase>
);

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
    buttonEnabled
}) => {
    return (
        <div className={styles['phone-box']}>
            <input className={cn('input', 'normal', 'phone')} type="text" value={value} onChange={onChange} placeholder={placeholder} disabled={inputDisabled}/>
            <ButtonBase onClick={onClick} className={cn('phone-button', { enabled: buttonEnabled, disabled: buttonDisabled })} disabled={buttonDisabled} disableRipple={buttonDisabled}>
                {buttonName}
            </ButtonBase>
            {children}
        </div>
    )
};

const AccountContainer = () => {
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
        address: '', detailAddress: ''
    });
    const [passwordCheck, setPasswordCheck] = useState(false);
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
            }
        }
    }, [USER_TOKEN, user, userState, phoneAuth, openDialog]);
    const callUpdatePassword = useCallback(async () => {
        if (passwordCheck) {
            const { passwordOld, password, passwordConfirm } = userState;
            try {
                const res = await requestPUTUpdatePassword(USER_TOKEN, passwordOld, password, passwordConfirm);
                if (res.data.msg === "성공") {
                    openDialog("성공적으로 변경되었습니다!", "");
                } else {
                    openDialog('내 정보 변경 도중 오류가 발생했습니다.', '잠시 후 다시 시도해 주세요.');
                }
            } catch (e) {
                openDialog('현재 비밀번호가 일치하지 않습니다.', '비밀번호를 다시 한 번 확인해 주세요.');
            }
        }
    }, [USER_TOKEN, userState, passwordCheck, openDialog]);
    const onClickUpdate = useCallback(async () => {
        callUpdateShop();
        callUpdateName();
        callUpdatePhoneNumber();
        callUpdatePassword();
        history.push(Paths.main.operation);
    }, [callUpdateName, callUpdatePassword, callUpdatePhoneNumber, callUpdateShop]);

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
                    <AccountInput title="가맹점명" text={user.shop_name} handleClick={callUpdateShop} possible>
                        <div className={styles['relative']}>
                            <input
                                className={cn('input', 'normal')}
                                type="text"
                                onChange={onChangeShop}
                                value={userState.shop_name}
                            />
                            <IconButton onClick={() => onRemoveValue('shop_name')} className={cn('remove-button')}>
                                <img src={RemoveIcon} alt="remove" />
                            </IconButton>
                        </div>
                    </AccountInput>
                    <AccountInput title="이름" text={user.name} handleClick={callUpdateName} possible>
                        <div className={styles['relative']}>
                            <input
                                className={cn('input', 'normal')}
                                type="text"
                                onChange={onChangeName}
                                value={userState.name}
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
                    >
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
                    >
                        <div>
                            <AccountPhoneInput
                                value={userState.phoneNumber}
                                onChange={onChangePhoneNumber}
                                placeholder="휴대폰 번호 인증"
                                buttonName={'인증번호 발송'}
                                buttonEnabled={userState.phoneNumber.length !== 0}
                            />
                            <AccountPhoneInput
                                value={userState.authNumber}
                                onChange={onChangeAuthNumber}
                                buttonName={'인증하기'}
                            />
                            <AccountPossible
                                text="휴대폰 번호 변경 확인"
                                possible={phoneAuth}
                            />
                        </div>
                    </AccountInput>
                </div>
                <div className={styles['area']}>
                    <AccountInput title="가맹점 주소" text={''}>
                        <div>
                            <div className={styles['address-box']}>
                                <div className={cn('address-area', 'i')}>
                                    <input
                                        className={cn('input', 'address')}
                                        type="text"
                                        onChange={onChangeAddress}
                                        value={userState.address}
                                    />
                                </div>
                                <div className={cn('address-area', 'b')}>
                                    <ButtonBase
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
                                    value={userState.detailAddress}
                                    placeholder="상세 주소를 입력하세요."
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