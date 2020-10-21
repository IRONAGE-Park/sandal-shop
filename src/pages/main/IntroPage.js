import React, { useEffect } from 'react';
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

const IntroPage = ({ history }) => {
    useEffect(() => {
        history.push(Paths.main.operation);
    }, [history]);
    
    return (
        <Page>
            <ImageArea>
                <Image src={Logo} alt="logo" />
            </ImageArea>
            <TextArea>가맹점 관리 페이지에 오신 것을 환영합니다.</TextArea>
        </Page>
    );
};

export default IntroPage;
