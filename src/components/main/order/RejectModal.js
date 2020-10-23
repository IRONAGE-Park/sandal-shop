import { ButtonBase, Dialog, useMediaQuery, useTheme } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { requestPUTOrderCancel } from '../../../api/order';
import { useDialog } from '../../../hooks/useDialog';

const RejectModal = ({ open, handleClose, order_id }) => {
    const openDialog = useDialog();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [loading, setLoading] = useState(false);

    const callPUTOrderCancel = useCallback(async (cancel_reason) => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const result = await requestPUTOrderCancel(JWT_TOKEN, order_id, cancel_reason);
                console.log(result);
            } catch (e) {
                openDialog("서버에 오류가 발생했습니다.", "잠시 후 다시 시도해 주세요.");
            }
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_id]);

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
        >
            <ButtonBase onClick={() => callPUTOrderCancel('이럼')}>
                주문 거절
            </ButtonBase>
        </Dialog>
    );
};

export default RejectModal;