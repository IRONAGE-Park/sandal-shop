import React, { useCallback, useEffect } from 'react';
/* Library */

import { useDispatch } from 'react-redux';
import { deleteUser } from '../store/user';
/* Redux */

import { useDialog } from '../hooks/useDialog';
import { useStore } from '../hooks/useStore';
/* Hooks */

import Paths from '../paths';
/* Paths */

const LogoutContainer = ({ history }) => {
    const JWT_TOKEN = useStore();
    const reduxDispatch = useDispatch();
    const openDialog = useDialog();

    const judgementLogout = useCallback(() => {
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인된 상태. */
            sessionStorage.removeItem('user_token');
            reduxDispatch(deleteUser(JWT_TOKEN));
            openDialog(
                "로그아웃 되셨습니다.",
                "서비스를 이용해 주셔서 감사합니다.",
                () => history.push(Paths.auth.signin)
            );
        }
    }, [JWT_TOKEN, reduxDispatch, openDialog, history]);

    useEffect(() => {
        judgementLogout();
    }, [judgementLogout]);

    return <></>;
};

export default LogoutContainer;