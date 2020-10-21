import React, { useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import styles from './ShowAgree.module.scss';
import { getAgreeTerm } from '../../api/agree';
import CloseIcon from '../svg/modal/CloseIcon';

export default ({ title, handleClose }) => {
    const [content, setContent] = useState('');

    const getContent = useCallback(async () => {
        if (title !== '') {
            const res = await getAgreeTerm();
            setContent(res);
        }
    }, [title]);

    useEffect(() => {
        getContent()
    }, [getContent])

    return (
        <Dialog
            className={styles['dialog']}
            open={title !== ''}
            scroll={'paper'}
            onClose={handleClose}
        >
            <DialogTitle className={styles['title']}>
                {title}
                <div className={styles['close']} onClick={handleClose}>
                    <CloseIcon />
                </div>
            </DialogTitle>

            <DialogContent>
                <DialogContentText
                    id="scroll-dialog-description"
                    tabIndex={-1}
                >
                    <pre className={styles['content']}>
                        {content}
                    </pre>
                </DialogContentText>
            </DialogContent>
            <DialogActions className={styles['button-area']}>
                <Button onClick={handleClose} className={styles['button']}>
                    확인
                </Button>
            </DialogActions>
        </Dialog>
    );
};
