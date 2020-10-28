import React from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import styles from './Agree.module.scss';
import CloseIcon from '../svg/modal/CloseIcon';
import { IconButton, Slide, useMediaQuery, useTheme } from '@material-ui/core';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default ({ open, title, handleClose }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down(768));
    const { company } = useSelector(state => state.company);
    return (
        <Dialog
            fullScreen={fullScreen}
            className={styles['dialog']}
            open={open}
            scroll={'paper'}
            onClose={handleClose}
            TransitionComponent={Transition}
            style={{
                zIndex: 2000
            }}
        >
            <DialogTitle className={styles['title']}>
                {title}
                <IconButton className={styles['close']} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {company && <DialogContent>
                    <p className={styles['content']}
                        dangerouslySetInnerHTML={{__html: title === '개인정보처리방침' ? company.private_policy_shop : company.use_terms_shop }}                        
                    />
            </DialogContent>}
            <DialogActions className={styles['button-area']}>
                <Button onClick={handleClose} className={styles['button']}>
                    확인
                </Button>
            </DialogActions>
        </Dialog>
    );
};
