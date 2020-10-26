import React, { useState, useCallback, useReducer } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames/bind';
/* Library */

import { inputReducer } from '../../lib/reducer';
import { requestPOSTLogin, requestPOSTPushToken } from '../../api/auth';
import { getMobileOperatingSystem } from '../../lib/os';
/* Custom Library */

import AuthInput from '../../components/auth/AuthInput';
import { ButtonBase } from '@material-ui/core';
/* Components */

import { useDialog } from '../../hooks/useDialog';
/* Hooks */

import styles from "./SignIn.module.scss";
/* Stylesheets */

import Check from '../../components/svg/auth/Check';
/* Statics */

import Paths from '../../paths';
/* Paths */

const cn = classnames.bind(styles);

const getLocalSaveEmail = () => {
    const saveEmail = localStorage.getItem('save_email');
    return saveEmail ? saveEmail : '';
};

export default ({ history }) => {
    const openDialog = useDialog();

    const [inputState, inputDispatch] = useReducer(inputReducer, {
        email: getLocalSaveEmail(), pw: ''
    });
    const [saveEmail, setSaveEmail] = useState(inputState.email !== '');

    const LoginOs = useCallback((JWT_TOKEN) => {
        window.setToken = async (token) => {
            try {
                const res = await requestPOSTPushToken(JWT_TOKEN, token);
                if (res.data.msg !== "success") {
                    alert(res.data.msg);
                }
            } catch (e) {
                alert(e);
            }
        }

        const login_os = getMobileOperatingSystem();
        if (login_os === 'Android') {
            if (typeof window.myJs !== 'undefined') {
                window.myJs.requestToken();
            }
        } else if (login_os === 'iOS') {
            if (typeof window.webkit !== 'undefined') {
                if (typeof window.webkit.messageHandlers !== 'undefined') {
                    window.webkit.messageHandlers.requestToken.postMessage("");
                }
            }
        }
    }, []);

    const onToggleEmail = useCallback(() => setSaveEmail(!saveEmail), [saveEmail]);
    const onChangeInput = useCallback(e => inputDispatch(e.target), []);
    const onClickLogin = useCallback(async () => {
        const { email, pw: password } = inputState;
        const result = await requestPOSTLogin({ email, password });
        if (result.status === 200) {
            if (result.data.msg === "회원가입 되어있지 않은 이메일입니다.") {
                // 회원가입 안되있는 이메일
                openDialog(result.data.msg, "이메일과 비밀번호를 확인해 주세요.");
            } else if (result.data.msg === "비밀번호가 틀렸습니다.") {
                // 비밀번호가 틀렸을 때
                openDialog(result.data.msg, "비밀번호를 확인해 주세요.");
            } else if (result.data.access_token) {
                // 로그인 성공 했을 때.
                LoginOs(result.data.access_token); // 푸쉬 토큰 보냄

                sessionStorage.setItem('user_token', result.data.access_token);
                if (saveEmail) {
                    // 이메일 저장하기를 했을 때,
                    localStorage.setItem('save_email', email); // 로컬 스토리지에 이메일을 추가함
                } else {
                    // 이메일 저장하기를 안 했을 때,
                    localStorage.removeItem('save_email'); // 로컬 스토리지에 저장된 이메일을 삭제함
                }
                history.push(Paths.main.index);
            } else {
                openDialog("가맹점 계정이 아닙니다.", "가맹점 계정으로 로그인 하시거나 가맹점 회원가입으로 새로 진행해 주세요.");
            }
        } else {
            openDialog("정보가 일치하지 않습니다.", "이메일과 비밀번호를 확인해 주세요.");
        }
    }, [inputState, saveEmail, LoginOs, openDialog, history]);

    return (
        <div className={styles['signin']}>
            <div className={styles['area']}>
                <div className={styles['container']}>
                    <form className={styles['content']}>
                        <div className={styles['typing-area']}>
                            <AuthInput
                                type="text"
                                name="email"
                                handleChange={onChangeInput}
                                value={inputState.email}
                                label="이메일"
                            />
                            <AuthInput
                                type="password"
                                name="pw"
                                handleChange={onChangeInput}
                                value={inputState.pw}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onClickLogin();
                                    }
                                }}
                                label="비밀번호"
                            />
                        </div>
                        <div className={styles['sub']}>
                            <p className={cn('link', 'save-email')} onClick={onToggleEmail}>
                                <Check checked={saveEmail} />
                                <span className={styles['save-font']}>이메일 저장하기</span>
                            </p>
                            <Link to={Paths.auth.find.index} className={cn('link', 'find')}>아이디/비밀번호 찾기</Link>
                        </div>
                        <div className={styles['action-area']}>
                            <div className={styles['button-area']}>
                                <ButtonBase onClick={onClickLogin} className={cn('interaction', 'button', 'login')}>로그인</ButtonBase>
                            </div>
                            <div className={styles['button-area']}>
                                <Link to={Paths.auth.signup}>
                                    <ButtonBase component="div" className={cn('interaction', 'button', 'signup')}>회원가입</ButtonBase>
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}; 