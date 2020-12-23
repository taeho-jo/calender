import React, { useState, useCallback, useEffect} from 'react'
import './timeTable.scss'

const AM = ["9:00", "10:00", "11:00", "12:00"];
const PM = ["1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00"];

const TEST_AM = ["9:00", "10:00", "11:00"];

const TimeTable = ({selectDate, setSelectDate}) => {
  const [selectTime, setSelectTime] = useState([]);

  const selectReserveTime = useCallback((time) => {
      if (selectTime.length >= 3) {
        // Alert.alert("이용시간 제한", "최대 3시간만 이용가능 합니다.");
        // alert('최대 3시간만 이용가능 합니다.')
        const removeArr = selectTime.filter((el) => el !== time);
        setSelectTime(removeArr);
        setSelectDate({
          ...selectDate,
          time: removeArr
        })
      } else if (selectTime.includes(time)) {
        const removeArr = selectTime.filter((el) => el !== time);
        setSelectTime(removeArr);
        setSelectDate({
          ...selectDate,
          time: removeArr
        })
      } else {
        setSelectTime([...selectTime, time]);
        setSelectDate({
          ...selectDate,
          time: [...selectTime, time]
        })
      }
    }, [selectTime])

  console.log(selectTime)

  const getAmButton = useCallback(() => {
    return AM.map((el, index) => {
      const disabled = TEST_AM.includes(el)
      const disabledStyle = disabled ? 'disabledStyle' : ''
      const active = selectTime.includes(el) ? 'active' : ''
      return (
        <button onClick={()=> selectReserveTime(el)} disabled={disabled} className={`activeButton ${disabledStyle} ${active}`}>
          {el}
        </button>
      )
    })
  },[selectTime])

  const getPmButton = useCallback(() => {
    return PM.map((el, index) => {
      const disabled = TEST_AM.includes(el)
      const disabledStyle = disabled ? 'disabledStyle' : ''
      const active = selectTime.includes(el) ? 'active' : ''
      return (
        <button onClick={()=> selectReserveTime(el)} disabled={disabled} className={`activeButton ${disabledStyle} ${active}`}>
          {el}
        </button>
      )
    })
  },[selectTime])


  return (
    <div className='mainContainer'>
      <span className='mainContainerTitle'>시간 선택</span>
      <span className='mainContainerSubTitle'>최대 3시간 이용가능</span>

      <div className='timeContainer'>
        <p className='timeTitle'>오전</p>
        <div className='buttonBox'>
          {getAmButton()}
        </div>
      </div>

      <div className='timeContainer pmContainer'>
        <p className='timeTitle'>오후</p>
        <div className='buttonBox'>
          {getPmButton()}
        </div>
      </div>
    </div>
  )
}

export default TimeTable