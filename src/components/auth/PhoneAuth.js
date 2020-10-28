import React, { useCallback, useState, useEffect, useRef } from 'react';
import classnames from 'classnames/bind';
import { useHistory } from 'react-router-dom';
/* Library */

import { secondsToMMSS } from '../../lib/formatter';
import { isCellPhoneForm } from '../../lib/formatChecker';
/* Custom Library */

import { requestPOSTCheckPhoneAuth, requestPOSTReceivePhoneAuth } from '../../api/auth';
/* API */

import { ButtonBase } from '@material-ui/core';
import AuthInput from './AuthInput';
/* Components */

import { useDialog } from '../../hooks/useDialog';
/* Hooks */

import styles from './PhoneAuth.module.scss';
/* Stylessheets */

import Paths from '../../paths';
/* Paths */

const cn = classnames.bind(styles);

const AUTH_NUMBER_SIZE = 6;

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

export default ({ phone: phoneNumber, setPhone: setPhoneNumber, setAuth }) => {
    const openDialog = useDialog();
    const history = useHistory();

    const [authState, setAuthState] = useState(0); // 현재 인증 상태
    // 0: 인증 메세지 보내기 전
    // 1: 인증 메세지 보냄
    // 2: 인증 완료
    const [authNumber, setAuthNumber] = useState(''); // 인증번호
    const [timer, setTimer] = useState(0); // 인증 시간(180 초)

    const phoneInputRef = useRef(null);
    const authInputRef = useRef(null);
    
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
                setAuth(true);
                setAuthState(2);
            } else if (res.data.msg === '유효하지 않는 인중번호 입니다. 인증번호를 재발송 해주세요.') {
                openDialog('유효하지 않는 인증번호입니다.', '인증번호를 재발송해 주세요.');
            } else {
                openDialog('인증번호가 틀렸습니다!', '인증번호를 다시 한 번 확인해 주세요!', () => authInputRef.current.focus());
            }
        } catch (e) {
            openDialog('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
            history.replace(Paths.auth.index);
        }
    }, [phoneNumber, authNumber, openDialog, setAuth, setAuthState, history]);

    return (
        <div className={styles['phone-auth']}>
            <AuthInput
                type="number"
                name="phone"
                handleChange={e => setPhoneNumber(e.target.value)}
                disabled={authState === 2}
                value={phoneNumber}
                label="휴대폰 번호 인증"
                reference={phoneInputRef}
            >
                <ButtonBase
                    className={cn('interaction', { active: authState })}
                    onClick={authState === 2 ? () => {}
                        : authState !== 1 ? onAuthSend : onAuthReSend}>
                    {authState === 2 ? '인증 완료'
                    : authState === 0 ? '인증번호 발송' : '인증번호 재발송'}
                </ButtonBase>
            </AuthInput>
            <div className={cn('auth', { view: authState === 1})}>
                <AuthInput
                    type="number"
                    name="phone_auth"
                    handleChange={e => setAuthNumber(e.target.value)}
                    value={authNumber}
                    disabled={authState !== 1}
                    reference={authInputRef}
                >
                    <ButtonBase
                        className={cn('interaction', { disable: authState !== 1 })}
                        onClick={authState !== 1 ? () => {} : onAuthCheck}
                        disableRipple={authState !== 1}
                        disabled={authState !== 1}>
                        {authState === 2 ? '인증완료' : '인증하기'}
                    </ButtonBase>
                    {authState === 1 && <Timer timer={timer} setTimer={setTimer} setAuthState={setAuthState} />}
                </AuthInput>
            </div>
        </div>
    );
};
