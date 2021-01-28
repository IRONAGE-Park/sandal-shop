import { ButtonBase, Dialog, IconButton, Slide, useMediaQuery, useTheme } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { requestPUTOrderCancel } from '../../api/order';
import { useDialog } from '../../hooks/useDialog';
import styles from './Reject.module.scss';
import CloseIcon from '../svg/modal/CloseIcon';
import Back from '../svg/header/back.svg';
import Loading from '../assets/Loading';

const rejectReasonList = [
    '거리가 너무 멀어서',
    '배달 주문 시간에 맞출 수 없어서',
    '주문 수량을 맞출 수 없어서',
    '가게 사정상 운영 시간을 앞당김'
];

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});


const RejectModal = ({ open, handleClose, order_id, orderData, setOrderData }) => {
    const openDialog = useDialog();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down(768));

    const [loading, setLoading] = useState(false);

    const [rejectReason, setRejectReason] = useState(rejectReasonList[0]);
    const [rejectReasonTyping, setRejectReasonTyping] = useState('');

    const callPUTOrderCancel = useCallback(async () => {
        const JWT_TOKEN = localStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const result = await requestPUTOrderCancel(JWT_TOKEN, order_id, rejectReason + ' ' + rejectReasonTyping);
                if (result.data.msg === '주문거절 완료') {
                    openDialog('주문이 정상적으로 거절되었습니다.', '');
                    setOrderData({
                        ...orderData,
                        od_status: 'order_cancel'
                    });
                    handleClose();
                }
            } catch (e) {
                openDialog("서버에 오류가 발생했습니다.", "잠시 후 다시 시도해 주세요.");
            }
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_id, rejectReason, rejectReasonTyping, orderData, setOrderData]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onClickReject = useCallback(() => openDialog("정말 해당 주문을 거절하시겠습니까?", '', () => callPUTOrderCancel(), true), [callPUTOrderCancel]);

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            style={{
                zIndex: 2000
            }}
        >
            <div className={styles['reject']}>
                <div className={styles['header']}>
                    <IconButton component="div" className={styles['m-close']} onClick={handleClose}>
                        <img src={Back} alt="back" />
                    </IconButton>
                    <p className={styles['title']}>주문 거절 사유</p>
                    <IconButton className={styles['close']} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className={styles['content']}>
                    <div className={styles['c-title']}>
                        취소 사유를 선택해 주세요.
                    </div>
                    <select className={styles['c-input']} value={rejectReason} onChange={e => setRejectReason(e.target.value)}>
                        {rejectReasonList.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))}
                    </select>
                </div>
                <div className={styles['content']}>
                    <div className={styles['c-title']}>
                        취소 사유 직접 입력
                    </div>
                    <textarea value={rejectReasonTyping} onChange={e => setRejectReasonTyping(e.target.value)} className={styles['c-input']} />
                </div>
                <ButtonBase className={styles['button']} onClick={onClickReject}>
                    확인
                </ButtonBase>
            </div>
            <Loading open={loading} />
        </Dialog>
    );
};

export default RejectModal;