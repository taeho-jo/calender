import React, { useState, useCallback, useEffect} from 'react'
import './timeTable.scss'

const ARR = ["9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00"];


const TimeTable = ({getChoiceTimeList, selectDate, setSelectDate, ARR, ABLE_LIST}) => {
  const AM = ARR.slice(0, 4)
  const PM = ARR.slice(4, 12)


  const [ableList, setAbleList] = useState([])
  const [selectTime, setSelectTime] = useState([]);
  const [listData, setListData] = useState({
    am: [],
    pm: []
  })

  useEffect(() => {
    if(ableList) {
      const TEST_AM = ableList.slice(0, 4)
      const TEST_PM = ableList.slice(4, 12)
      setListData({
        am: TEST_AM,
        pm: TEST_PM
      })
    }
  },[ableList])

  useEffect(() => {
    if(ABLE_LIST) {
      setAbleList(ABLE_LIST)
    }
  },[ABLE_LIST])

  useEffect(() => {
    setSelectTime([])
  },[selectDate.startDate])


  useEffect(() => {
    getChoiceTimeList(selectTime)
  },[selectTime])

  const selectReserveTime = useCallback((time) => {
    if(selectTime.length === 0) {
      const list = [...ableList]

      if(list[time + 1] === '1') {
        for(let i = time + 1; i < list.length; i++) {
          list.splice(i, 1, '1')
        }

        for(let i = 0; i < time; i++) {
          list.splice(i, 1, '1')
        }
      } else {
        for(let i = time+3; i < list.length; i++) {
          list.splice(i, 1, '1')
        }

        for(let i = 0; i < time; i++) {
          list.splice(i, 1, '1')
        }
      }

      setAbleList(list)
      setSelectTime([...selectTime, time]);
        setSelectDate({
          ...selectDate,
          time: [...selectTime, time]
        })
    } else {
      if (selectTime.includes(time) && selectTime[selectTime.length-1] === time) {
        const removeArr = selectTime.filter((el) => el !== time);
        setSelectTime(removeArr);
        setSelectDate({
          ...selectDate,
          time: removeArr
        })
      } else if(selectTime.includes(time) && selectTime[selectTime.length-1] !== time) {
        return;
      } else if(time - selectTime[0] === 1 ) {
        setSelectTime([...selectTime, time]);
        setSelectDate({
          ...selectDate,
          time: [...selectTime, time]
        })
      } else if(time - selectTime[0] > 1) {
        const arr = []
        for (let i = selectTime[0]; i < time+1; i++) {
          arr.push(i)
        }
        setSelectTime(arr);
        setSelectDate({
          ...selectDate,
          time: arr
        })
      }
    }

  }, [selectTime, selectDate, ableList])

  const disableButton = useCallback((arr, index) => {
    if(arr[index] === '1') {
      return true
    } else {
      return false
    }
  },[])
  
  const resetButton = useCallback(() => {
    setAbleList(ABLE_LIST)
    setSelectTime([])
    setSelectDate({
      ...selectDate,
      time: []
    })
  },[ableList, selectTime, selectDate])

  const getAmButton = useCallback(() => {
    return AM.map((el, index) => {
      // const disabled = TEST_AM.includes(el)
      const disabled = disableButton(listData.am, index)
      // alert(disableButton(TEST_AM, index))
      const disabledStyle = disabled ? 'disabledStyle' : ''
      const active = selectTime.includes(index) ? 'active' : ''
      return (
        <button onClick={()=> selectReserveTime(index)} disabled={disabled} className={`activeButton ${disabledStyle} ${active}`}>
          {el}
        </button>
      )
    })
  },[selectTime, selectDate, listData, ABLE_LIST])

  const getPmButton = useCallback(() => {
    return PM.map((el, index) => {
      const disabled = disableButton(listData.pm, index)
      const disabledStyle = disabled ? 'disabledStyle' : ''
      const active = selectTime.includes(index + 4) ? 'active' : ''
      return (
        <button onClick={()=> selectReserveTime(index + 4)} disabled={disabled} className={`activeButton ${disabledStyle} ${active}`}>
          {el}
        </button>
      )
    })
  },[selectTime, selectDate, listData, ABLE_LIST])

  // 예약시간 미리보기
  const firstTime = selectTime.length > 0 ? ARR.slice(selectTime[0], selectTime[0] + 1).join() : ''
  const secondTime = selectTime.length > 1 ? ARR.slice(selectTime[selectTime.length-1], selectTime[selectTime.length-1]+1).join() : ''

  // 예약시간 미리보기
  const firstSelectTime = firstTime !== '' ? (firstTime.split(':')[0] >= 9 && firstTime.split(':')[0] < 12 ? `오전 ${firstTime}` : `오후 ${firstTime}`) : ''
  const secondSelectTime = secondTime !== '' ? (secondTime.split(':')[0] >= 9 && secondTime.split(':')[0] < 12 ? `오전 ${secondTime}` : `오후 ${secondTime}`) : ''


  return (
    <div className='mainContainer'>
      <div className='timeTableTitle'>
        <div>
          <span className='mainContainerTitle'>시간 선택</span>
          <span className='mainContainerSubTitle'>최대 3시간 이용가능</span>
        </div>
        <button className='resetBtn' onClick={resetButton}>다시선택</button>
      </div>


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

      <div className='selectTimeBox'>
        <div>
          <span className='boxTitle'>예약일 : </span>
          <span>{selectDate.startDate}</span>
        </div>
        <div className='timeBox'>
          <div className='box'>
            <span className='boxTitle'>예약시작일 : </span>
            <span>{firstSelectTime}</span>
          </div>
          <div className='box'>
            <span className='boxTitle'>예약종료일 : </span>
            <span>{selectTime.length === 1 ? firstSelectTime : secondSelectTime}</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default TimeTable