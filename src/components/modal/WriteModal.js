import { ButtonBase, Dialog, IconButton, Slide, useMediaQuery, useTheme } from '@material-ui/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDialog } from '../../hooks/useDialog';
import styles from './Write.module.scss';
import CloseIcon from '../svg/modal/CloseIcon';
import RemoveIcon from '../svg/remove.svg';
import Back from '../svg/header/back.svg';
import Loading from '../assets/Loading';
import { requestPOSTQNAStore } from '../../api/support';
import Paths from '../../paths';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const WriteModal = ({ open, handleClose }) => {
    const openDialog = useDialog();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down(768));

    const titleRef = useRef(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]);

    const [loading, setLoading] = useState(false);

    const onChangeFiles = useCallback(e => {
        const { files: f } = e.target;
        const fileArray = [];
        for (let i = 0; i < f.length; i++) {
            fileArray.push(f[i]);
        }
        setFiles(fileArray);
    }, []);
    const onDeleteFile = useCallback(name => setFiles(files => files.filter(file => file.name !== name)), []);

    const callPOSTQnaWrite = useCallback(async () => {
        const JWT_TOKEN = localStorage.getItem('user_token');
        if (JWT_TOKEN) {
            /* 토큰이 존재함 => 로그인 된 상태. */
            setLoading(true);
            try {
                const res = await requestPOSTQNAStore(JWT_TOKEN, title, content, files);
                if (res.data.msg === "성공") {
                    openDialog('성공적으로 작성하였습니다!', '답변이 올 때까지는 조금 시간이 소요됩니다.');
                    window.location.href = Paths.main.support + '/qna';
                } else {
                    openDialog('작성하는 도중 오류가 발생했습니다!', '다시 시도해 주세요.');
                }
            } catch (e) {
                openDialog("서버에 오류가 발생했습니다.", "잠시 후 다시 시도해 주세요.");
            }
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title, content, files]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onClickWrite = useCallback(() => openDialog("정말 해당 문의를 작성하시겠습니까?", '', () => callPOSTQnaWrite(), true), [callPOSTQnaWrite]);

    useEffect(() => {
        if (open) {
            // 모달이 켜졌을 때 포커싱
            setTimeout(() => {
                if (titleRef.current) {
                    titleRef.current.focus();
                }
            }, 150);
        }
    }, [open]);
    
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
            <div className={styles['write']}>
                <div className={styles['header']}>
                    <IconButton component="div" className={styles['m-close']} onClick={handleClose}>
                        <img src={Back} alt="back" />
                    </IconButton>
                    <p className={styles['title']}>1:1 문의 작성</p>
                    <IconButton className={styles['close']} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className={styles['content']}>
                    <div className={styles['c-title']}>
                        문의 제목
                    </div>
                    <input ref={titleRef} type="text" value={title} onChange={e => setTitle(e.target.value)} className={styles['c-input']} />
                </div>
                <div className={styles['content']}>
                    <div className={styles['c-title']}>
                        문의 내용
                    </div>
                    <textarea value={content} onChange={e => setContent(e.target.value)} className={styles['c-input']} />
                </div>
                <div className={styles['content']}>
                    <div className={styles['c-title']}>
                        첨부 파일
                    </div>
                    <div className={styles['c-files']}>
                        <div className={styles['file-list']}>
                        {files.map(file => (
                            <div className={styles['file-item']} key={file.name}>
                                {file.name}
                                <ButtonBase component="div" className={styles['delete']} onClick={() => onDeleteFile(file.name)}>
                                    <img src={RemoveIcon} alt="remove" />
                                </ButtonBase>
                            </div>
                        ))}
                        </div>
                        <input className={styles['q-files']} multiple="multiple" type="file" onChange={onChangeFiles} id="file-setter" accept="image/gif, image/jpeg, image/png, image/svg" />
                        <ButtonBase component="div" className={styles['file-finder']}>
                            <label className={styles['file-setter']} htmlFor="file-setter">
                                <div className={styles['font']}>
                                    찾아보기
                                </div>
                            </label> 
                        </ButtonBase>
                    </div>
                    <p className={styles['warning']}>파일은 최대 3개까지 첨부 가능합니다.</p>
                </div>
                <ButtonBase className={styles['button']} onClick={onClickWrite}>
                    등록
                </ButtonBase>
            </div>
            <Loading open={loading} />
        </Dialog>
    );
};

export default WriteModal;