/* global kakao */
import axios from 'axios';
/* Library */

axios.defaults.headers['Context-Type'] = 'application/json';

export const requestGETLocation = async (query, callback) => {
    /*
        주소 정보를 기반으로 그 주소의 좌표를 받아오는 Kakao Open Javascript API

        기존 다음 우편번호 API에서 받아온 주소 검색 값을 요청하면 좌표 및 정보를 반환함.

        문서 보기: https://apis.map.kakao.com/web/documentation/#services_Geocoder
    */
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(query, callback);
}