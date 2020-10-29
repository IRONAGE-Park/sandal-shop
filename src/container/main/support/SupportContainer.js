import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import { useHistory } from 'react-router-dom';
import { requestGETFAQList, requestGETNoticeList, requestGETQNAList } from '../../../api/support';
import Loading from '../../../components/assets/Loading';
import CustomTabs from '../../../components/main/assets/Tabs';
import { useDialog } from '../../../hooks/useDialog';
import Paths from '../../../paths';
import FAQContainer from './FAQContainer';
import NoticeContainer from './NoticeContainer';
import QNAContainer from './QNAContainer';
import styles from './SupportContainer.module.scss';
import NoticeDetailContainer from './NoticeDetailContainer';

const getPaths = ['notice', 'faq', 'qna'];

const getFaqTypeIndex = ['회원가입', '쿠폰', '결제', '포인트', '배달', '문구서비스'];

const cn = classnames.bind(styles);

const SupportContainer = ({ mode, modal, id }) => {
    const history = useHistory();
    const openDialog = useDialog();

    const [loading, setLoading] = useState(false);
    const [faqType, setFaqType] = useState('회원가입');

    const [noticeList, setNoticeList] = useState([]);
    const [faqList, setFaqList] = useState([]);
    const [qnaList, setQnaList] = useState([]);

    const index = getPaths.findIndex(path => path === mode); // 현재 보여줘야 할 내용 결정.

    const callGETNotice = useCallback(async () => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN && noticeList.length === 0) {
            setLoading(true);
            try {
                const res = await requestGETNoticeList(JWT_TOKEN, 0, 1000);
                if (res.data.msg === "성공") {
                    setNoticeList(res.data.query.notices);
                } else {
                    openDialog("공지사항을 조회하는데 실패하였습니다", "잠시 후 다시 시도해 주세요.");
                }
            } catch (e) {
                openDialog("공지사항을 조회하는데 실패하였습니다", "잠시 후 다시 시도해 주세요.");
            }
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noticeList]);

    const callGETFAQ = useCallback(async () => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN) {
            setLoading(true);
            try {
                const faqTypeIndex = getFaqTypeIndex.findIndex(f => faqType === f);
                const res = await requestGETFAQList(JWT_TOKEN, faqTypeIndex);
                if (res.data.msg === "성공") {
                    setFaqList(res.data.query);
                } else {
                    openDialog("자주 묻는 질문을 조회하는데 실패하였습니다", "잠시 후 다시 시도해 주세요.");
                }
            } catch (e) {
                openDialog("자주 묻는 질문을 조회하는데 실패하였습니다", "잠시 후 다시 시도해 주세요.");
            }
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [faqType]);

    const callGETQNA = useCallback(async () => {
        const JWT_TOKEN = sessionStorage.getItem('user_token');
        if (JWT_TOKEN && qnaList.length === 0) {
            setLoading(true);
            try {
                const res = await requestGETQNAList(JWT_TOKEN, 0, 1000);
                if (res.data.msg === "성공") {
                    setQnaList(res.data.query.qnas);
                } else {
                    openDialog("1:1 문의를 조회하는데 실패하였습니다", "잠시 후 다시 시도해 주세요.");
                }
            } catch (e) {
                openDialog("1:1 문의를 조회하는데 실패하였습니다", "잠시 후 다시 시도해 주세요.");
            }
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qnaList]);

    useEffect(() => {
        if (modal !== 'view') {
            switch (index) {
                case 0:
                    callGETNotice();
                    break;
                case 1:
                    callGETFAQ();
                    break;
                case 2:
                    callGETQNA();
                    break;
                default:
                    history.push(Paths.main.support + '/notice')
                    break;
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, modal, callGETFAQ]);
    
    return (
        <div className={cn('container', { no_tab: id })}>
            <div className={cn('tab', { only_mobile: id })}>
                <CustomTabs
                    idx={index}
                    categories={[
                        { ca_name: '공지사항' },
                        { ca_name: '자주 묻는 질문' },
                        { ca_name: '1:1 문의' },
                    ]}
                    onChange={(e, path) => history.push(Paths.main.support + '/' + getPaths[path])}
                />
            </div>
            {index === 1 && <>
            <div className={styles['m-label']}>자주 묻는 질문</div>
            <div className={styles['m-selector']}>
                <select value={faqType} onChange={e => setFaqType(e.target.value)}>
                    {getFaqTypeIndex.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>
            <div className={styles['sub-tab']}>
                <div className={styles['wrap']}>
                    {getFaqTypeIndex.map(type =>
                    <p className={cn('selector', { selected: type === faqType })}
                    key={type}
                    onClick={() => setFaqType(type)}>{type}</p>)}
                </div>
            </div>
            </>}
            {!loading && <>
               {modal === 'view' ? <NoticeDetailContainer viewId={id} />
               : index === 0 ? <NoticeContainer noticeList={noticeList} />
               : (index === 1 ? <FAQContainer faqList={faqList} faqType={faqType} setFaqType={setFaqType} />
                : <QNAContainer qnaList={qnaList} modal={modal} />)} 
            </>}
            <Loading open={loading} />
        </div>
    );
};

export default SupportContainer;