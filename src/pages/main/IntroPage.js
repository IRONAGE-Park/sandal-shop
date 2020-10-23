import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Logo from '../../components/svg/sandal_logo.svg';
import Paths from '../../paths';

const Page = styled.div`
    padding: 5% 20%;
`;

const ImageArea = styled.div`
    padding: 10%;
    background-color: #008762;
    border-radius: 50px;
`;

const Image = styled.img`
    width: 100%;
`;

const TextArea = styled.h3`
    margin-top: 30px;
    font-size: 3rem;
    color: #222;
    text-align: center;
    word-break: keep-all;
`;

const ContentArea = styled.p`
    margin-top: 20px;
    font-size: 2rem;
    color: #777;
    text-align: center;
    word-break: keep-all;
`

const IntroPage = ({ history }) => {
    const user = useSelector(state => state.user);

    useEffect(() => {
        if (user.confirm === 1) {
            // 권한을 가진 유저는 접근할 수 없음.
            history.push(Paths.main.operation);
        }
    }, []);
    
    return (
        <Page>
            <ImageArea>
                <Image src={Logo} alt="logo" />
            </ImageArea>
            <TextArea>가맹점 관리 페이지에 오신 것을 환영합니다.</TextArea>
            <ContentArea>가맹점 사용 승인 후 정상적인 기능을 이용하실 수 있습니다.</ContentArea>
        </Page>
    );
};

export default IntroPage;
