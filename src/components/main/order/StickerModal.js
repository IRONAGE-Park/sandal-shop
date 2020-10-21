import React, { useCallback, useEffect, useState } from 'react';
import { requestGETOrderSticker } from '../../../api/order';
import { useDialog } from '../../../hooks/useDialog';

const StickerModal = (open, handleClose, order_id) => {
    const openDialog = useDialog();

    const [loading, setLoading] = useState(false);

    const callGETORderSticker = useCallback(async () => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const result = await requestGETOrderSticker(JWT_TOKEN, order_id);
                console.log(result);
            } catch (e) {
                openDialog("서버에 오류가 발생했습니다.", "잠시 후 다시 시도해 주세요.");
            }
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_id]);
    
    useEffect(() => {
        callGETORderSticker();
    }, [callGETORderSticker]);

    return (
        <div>

        </div>
    );
};

export default StickerModal;