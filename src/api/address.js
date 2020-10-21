/* global kakao */
import axios from 'axios';
/* Library */

import makeFormData from '../lib/makeFormData';
/* Custom Library */

axios.defaults.headers['Context-Type'] = 'application/json';

const KAKAO_API_KEY = 'd331cd9c7be41686c695d2d7244978d3';

export const requestGETLocationByAddress = async (query) => {
    /*
        주소 정보를 기반으로 그 주소의 좌표를 받아오는 Kakao Open REST API
        
        기존 다음 우편번호 API에서 받아온 주소 검색 값을 요청하면 좌표 및 정보를 반환함.
    
        문서 보기: https://developers.kakao.com/docs/latest/ko/local/dev-guide
    */
    const URL = 'https://dapi.kakao.com/v2/local/search/address.json';

    const formData = makeFormData({ query });

    axios.defaults.headers.common['Authorization'] = `KakaoAK ${KAKAO_API_KEY}`;
    const res = await axios.get(URL, formData);
    return res;
};

export const requestGETLocation = async (query, callback) => {
    /*
        주소 정보를 기반으로 그 주소의 좌표를 받아오는 Kakao Open Javascript API

        기존 다음 우편번호 API에서 받아온 주소 검색 값을 요청하면 좌표 및 정보를 반환함.

        문서 보기: https://apis.map.kakao.com/web/documentation/#services_Geocoder
    */
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(query, callback);
}