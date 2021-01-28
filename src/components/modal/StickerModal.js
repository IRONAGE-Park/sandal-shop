import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import { Dialog, makeStyles, Slide, useMediaQuery, useTheme } from '@material-ui/core';
import { requestGETOrderSticker } from '../../api/order';
import { useDialog } from '../../hooks/useDialog';
import { DBImageFormat } from '../../lib/formatter';
import ErrorCoverImage from '../assets/ErrorCoverImage';

import styles from './Sticker.module.scss';

const cn = classnames.bind(styles);

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
    textContent: {
        textAlign: 'center',
        fontSize: '18px',
        padding: '20px'
    }
}));

const StickerModal = ({ open, handleClose, order_id }) => {
    const classes = useStyles();
    const openDialog = useDialog();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down(768));

    const [sticker, setSticker] = useState({});

    const callGETORderSticker = useCallback(async () => {
        const JWT_TOKEN = localStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            try {
                const result = await requestGETOrderSticker(JWT_TOKEN, order_id);
                if (result.data.msg === "성공!") {
                    setSticker(result.data.query.sticker);
                } else {

                }
            } catch (e) {
                openDialog("서버에 오류가 발생했습니다.", "잠시 후 다시 시도해 주세요.");
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_id]);
    
    useEffect(() => {
        callGETORderSticker();
    }, [callGETORderSticker]);

    return (
        <Dialog
            fullScreen={fullScreen} 
            className={classes.dialog}
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <div className={styles['preview']}>
                <div disabled className={cn('input-preview', 'input-box')}>
                    <div className={cn('circle', 'preview_out')}>
                        <div className={cn('circle', 'preview_in')}>
                            <div className={cn('box', 'image')}>
                                <ErrorCoverImage className={styles['logo']} src={DBImageFormat(sticker.sticker_logo)}/>
                                <p className={styles['name']}>샌달 드림</p>
                            </div>
                            <div className={cn('box', 'text')}>
                                <p className={styles['phrase']}>{sticker.sticker_text}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default StickerModal;