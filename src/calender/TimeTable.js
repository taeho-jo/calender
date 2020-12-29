import React, { useState, useCallback, useEffect} from 'react'
import './timeTable.scss'

const ARR = ["9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00"];
const AM = ARR.slice(0, 4)
const PM = ARR.slice(4, 12)

const TEST_ARR = [0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1,];
const TEST_AM = TEST_ARR.slice(0, 4)
const TEST_PM = TEST_ARR.slice(4, 12)

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

  const disableButton = (arr, index) => {
    if(arr[index] === 0) {
      return true
    } else {
      return false
    }
  }

  const getAmButton = useCallback(() => {
    return AM.map((el, index) => {
      // const disabled = TEST_AM.includes(el)
      const disabled = disableButton(TEST_AM, index)
      // alert(disableButton(TEST_AM, index))
      const disabledStyle = disabled ? 'disabledStyle' : ''
      const active = selectTime.includes(index) ? 'active' : ''
      return (
        <button onClick={()=> selectReserveTime(index)} disabled={disabled} className={`activeButton ${disabledStyle} ${active}`}>
          {el}
        </button>
      )
    })
  },[selectTime])

  const getPmButton = useCallback(() => {
    return PM.map((el, index) => {
      const disabled = disableButton(TEST_PM, index)
      const disabledStyle = disabled ? 'disabledStyle' : ''
      const active = selectTime.includes(index + 4) ? 'active' : ''
      return (
        <button onClick={()=> selectReserveTime(index + 4)} disabled={disabled} className={`activeButton ${disabledStyle} ${active}`}>
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