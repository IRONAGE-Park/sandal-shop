import { Dialog, makeStyles, Slide } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { requestGETOrderSticker } from '../../../api/order';
import { useDialog } from '../../../hooks/useDialog';
import { DBImageFormat } from '../../../lib/formatter';
import ErrorCoverImage from '../assets/ErrorCoverImage';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    dialog: {
        position: 'relative',
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    imageContent: {
        width: '250px',
        padding: '20px',
        textAlign: 'center'
    },
    image: {
        width: '200px', height: '200px',
        border: 'solid 1px #ccc', overflow: 'hidden'
    },
    textContent: {
        textAlign: 'center',
        fontSize: '18px',
        padding: '20px'
    }
}));

const StickerModal = ({ open, handleClose, order_id }) => {
    const classes = useStyles();
    const openDialog = useDialog();

    const [loading, setLoading] = useState(false);

    const [sticker, setSticker] = useState({});

    const callGETORderSticker = useCallback(async () => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const result = await requestGETOrderSticker(JWT_TOKEN, order_id);
                if (result.data.msg === "성공!") {
                    setSticker(result.data.query.sticker);
                } else {

                }
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
        <Dialog className={classes.dialog} open={open} onClose={handleClose} TransitionComponent={Transition}>
            <div className={classes.imageContent}>
                {!loading && sticker.sticker_logo && <ErrorCoverImage className={classes.image} src={DBImageFormat(sticker.sticker_logo)}/>}
            </div>
            <p className={classes.textContent}>{!loading && sticker.sticker_text}</p>
        </Dialog>
    );
};

export default StickerModal;