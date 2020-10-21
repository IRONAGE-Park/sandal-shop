import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
/* Library */

/*
    선택 박스 컴포넌트.

    선택 박스의 타입이 주어지면
    그에 맞는 엘리먼트들을 선택할 수 있는 select를 렌더링.
    엘리먼트를 선택하면 onChange 이벤트 발생.
*/

const createMenus = (type) => {
    /*
        선택 박스의 타입에 맞춰서
        그에 맞는 Elements를 뽑아주는 함수.
    */
    const result = [];
    switch (type) {
        case '년':
            for (let i = 1970; i < 2050; i++) {
                const years = i + '년';
                result.push({
                    name: years,
                    value: i + 1
                });
            }
            return result;
        case '월':
            for (let i = 0; i < 12; i++) {
                result.push({
                    name: `${i + 1}월`,
                    value: i + 1
                });
            }
            return result;
        case '일':
            for (let i = 0; i < 31; i++) {
                result.push({
                    name: `${i + 1}일`,
                    value: i + 1
                });
            }
            return result;
        case '시':
            // 시간을 선택할 경우 오전 ~ 오후 12시까지 모두 뽑음.
            for (let i = 0; i < 24; i++) {
                const quarter = i <= 12 ? '오전' : '오후';
                result.push({
                    name: `${quarter} ${(i % 12) + 1}시`,
                    value: i + 1,
                });
            }
            return result;
        case '분':
            // 분을 선택할 경우 1분 ~ 60분까지 모두 뽑음.
            for (let i = 0; i < 6; i++) {
                result.push({
                    name: `${i * 10}분`,
                    value: i * 10,
                });
            }
            return result;
        default:
            return [];
    }
};
const MainSelectBox = ({
    id, selectType, value, setValue,
    width = "100%"
}) => {
    /*
        메인 페이지 곳곳에서 사용하는 선택 박스 컴포넌트.
        
        Select의 type을 바탕으로 필요한 데이터 호출 후 렌더링해 줌.
    */
    const useStyles = makeStyles((theme) => ({
        formControl: {
            minWidth: width,
        },
    })); // 선택 박스의 스타일 생성
    const classes = useStyles();
    const handleChange = e => setValue(e.target.value);
    const menus = createMenus(selectType);
    return (
        <FormControl className={classes.formControl}>
            <InputLabel id={`${id}-label`}>{selectType}</InputLabel>
            <Select
                labelId={`${id}-label`}
                id={id}
                value={value}
                onChange={handleChange}
            >
                {menus.map((menu) => (
                    <MenuItem key={menu.value} value={menu.value}>
                        {menu.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default MainSelectBox;
