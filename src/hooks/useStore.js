import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
/* Library */

import { useDialog } from './useDialog';
/* Hooks */

import Paths from '../paths';
/* Paths */

export const useStore = (isReplace = true) => {
    const JWT_USER_TOKEN = sessionStorage.getItem('user_token');
    const history = useHistory();
    const openDialog = useDialog();

    useEffect(() => {
        if (!JWT_USER_TOKEN && isReplace) {
            openDialog(
                '로그인이 필요한 서비스입니다.',
                '로그인 후에 이용해 주세요.',
                () => history.replace(Paths.auth.signin),
            );
        }
    }, [JWT_USER_TOKEN, history, openDialog, isReplace]);

    return JWT_USER_TOKEN;
};
