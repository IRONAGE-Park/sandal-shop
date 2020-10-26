import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Loading from '../../components/assets/Loading';
import CustomTabs from '../../components/main/assets/Tabs';
import { useDialog } from '../../hooks/useDialog';
import Paths from '../../paths';
import styles from './SupportContainer.module.scss';

const getPaths = ['notice', 'faq', 'qna'];

const SupportContainer = ({ mode, modal, id }) => {
    const history = useHistory();
    const openDialog = useDialog();

    const [loading, setLoading] = useState(false);


    const index = getPaths.findIndex(path => path === mode); // 현재 보여줘야 할 내용 결정.
    
    return (
        <div className={styles['container']}>
            <div className={styles['tab']}>
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

            <Loading open={loading} />
        </div>
    );
};

export default SupportContainer;