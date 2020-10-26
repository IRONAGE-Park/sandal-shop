import axios from 'axios';
/* Library */

import Paths from '../paths';
/* Paths Object */

axios.defaults.headers['Context-Type'] = 'application/json';

export const requestGETNoticeList = async (JWT_TOKEN, offset, limit) => {
    /*
        가맹점 공지사항 리스트 Request API

        로그인 된 JWT_TOKEN을 첨부하여 공지사항 리스트를 가져오는 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/notice/list';
    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.get(URL, { params: { offset, limit } });
    return res;
}

export const requestGETNoticeView = async (JWT_TOKEN, id) => {
    /*
        가맹점 공지사항 상세 보기 Request API

        로그인 된 JWT_TOKEN을 첨부하여 공지사항 상세 정보를 가져오는 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/notice/show';
    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.get(URL, { params: { id } });
    return res;
}

export const requestGETFAQList = async (JWT_TOKEN, faq_type) => {
    /*
        가맹점 자주 묻는 질문 리스트 Request API

        로그인 된 JWT_TOKEN과 질문 타입을 첨부하여 자주 묻는 질문 리스트를 가져오는 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/faq/list';
    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.get(URL, { params: { faq_type } });
    return res;
}

export const requestGETQNAList = async (JWT_TOKEN, offset, limit) => {
    /*
        가맹점 1:1 문의 리스트 Request API

        로그인 된 JWT_TOKEN을 첨부하여 공지사항 리스트를 가져오는 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/qna/list';
    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.get(URL, { params: { offset, limit } });
    return res;
}

export const requestGETQNAView = async (JWT_TOKEN, id) => {
    /*
        가맹점 1:1 문의 상세 보기 Request API

        로그인 된 JWT_TOKEN을 첨부하여 1:1 문의 상세 정보를 가져오는 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/qna/show';
    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.get(URL, { params: { id } });
    return res;
}

export const requestPOSTQNAStore = async (JWT_TOKEN, subject, question, q_files) => {
    /*
        가맹점 1:1 문의 올리기 Request API

        로그인 된 JWT_TOKEN과 제목, 내용, 파일을 첨부하여 1:1 문의를 올리는 요청을 보냄.

        문서보기:
    */
    const URL = Paths.api + 'shop/qna';
    
    const formData = new FormData();    
    formData.append('subject', subject);
    formData.append('question', question);
    Array.from(q_files).forEach(image => formData.append('q_files[]', image, image.name));
    
    axios.defaults.headers['Context-Type'] = 'multipart/form-data';
    axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

    const res = await axios.post(URL, formData);
    return res;
}