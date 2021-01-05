import React, { useState, useEffect, useCallback, useRef } from 'react'
import './calendar.scss'
import moment from "moment";
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import axios from 'axios'
import TimeTable from "./TimeTable";


// 오늘 날짜
const TODAY = moment().format('YYYY-MM-DD')
// 오늘 년 월
const CUREENT_MONTH = moment().format('YYYY-MM')

const ARR = ["9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00"];
const ABLE_LIST = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0',]

const Calendar = () => {
  const mainCalendar = useRef(null)

  const [buttonDisable, setButtonDisable] = useState(true)

  const [timeSelectAbleList, setTimeSelectAbleList] = useState(ABLE_LIST)

  const [ableDateList, setAbleDateList] = useState({
    prev: [],
    selected: [],
    next: []
  })
  // 선택된 시작 날짜와 마지막 날짜
  const [selectDate, setSelectDate] = useState({
    startDate: '',
    endDate: '',
    date: [],
    time: []
  })
  // 중간날짜
  const [middleDate, setMiddleDate] = useState([])

  // 한달 시작 날짜와 마지막 날짜
  const [monthDate, setMonthDate] = useState({
    startDate: moment(`${CUREENT_MONTH}-01`).format('YYYY-MM-DD'),
    endDate: moment(`${CUREENT_MONTH}-01`).add(1, 'M').add(-1, 'd').format('YYYY-MM-DD')
  })
  // 한달 시작 요일과 마지막 요일
  const [monthDay, setMonthDay] = useState({
    startDay: moment(`${CUREENT_MONTH}-01`).day(),
    endDay: moment(`${CUREENT_MONTH}-01`).add(1, 'M').add(-1, 'd').day()
  })

  const [monthLength, setMonthLength] = useState({
    prevMonth: 0,
    nextMonth: 0
  })

  // 날짜 계산을 위한 덧셈 뺄셈 숫자
  const [ num, setNum ] = useState(0)

  // 달력 제목 년 월
  const [standard, setStandard] = useState('')

  // 날짜 계산을 위한 기준 년 월 일
  const [dashStandard, setDashStandard] = useState('')
  const [threeMonth, setThreeMonth] = useState({
    prevMonth: '',
    currentMonth: '',
    nextMonth: ''
  })

  // 모든 날짜를 넣는 배열
  const [dateArr, setDateArr] = useState([])

  // 날짜 계산
  const calculationDate = useCallback(() => {
    const startMonth = moment(`${dashStandard}-01`).format('YYYY-MM-DD')
    const startDay = moment(startMonth).day()

    const endMonth = moment(`${dashStandard}-01`).add(1, 'M').add(-1, 'd').format('YYYY-MM-DD')
    const endDay = moment(endMonth).day()

    // 이전 달 일수 계산
    const prevStartMonth =  moment(`${dashStandard}-01`).add(-1, 'M').format('YYYY-MM-DD')
    const prevEndMonth =  moment(`${dashStandard}-01`).add(-1, 'd').format('YYYY-MM-DD')
    const prevMonthLenght = moment(prevEndMonth).diff(moment(prevStartMonth), "days");

    // 다음 달 일수 계산
    const nextStartMonth =  moment(`${dashStandard}-01`).add(+1, 'M').format('YYYY-MM-DD')
    const nextEndMonth =  moment(`${dashStandard}-01`).add(2, 'M').add(-1, 'd').format('YYYY-MM-DD')
    const nextMonthLenght = moment(nextEndMonth).diff(moment(nextStartMonth), "days");

    setMonthDate({
      startDate: startMonth,
      endDate: endMonth
    })
    setMonthDay({
      startDay: startDay,
      endDay: endDay
    })

    setMonthLength({
      prevMonth: prevMonthLenght + 1,
      nextMonth: nextMonthLenght + 1
    })
  },[dashStandard, monthDate, monthDay, monthLength])

  // 예약 가능 날짜 판단
  const selectAbleDate = useCallback((i) => {
    if (ableDateList.selected[i] === '0') {
      return false
    } else {
      return true
    }
  },[ableDateList])

  const prevSelectAbleDate = useCallback((i, arr, length, a) => {
    const month = arr.slice(0, length)
    const month2 = month.slice(month.length - a, month.length)

    if(month2[i-1] === '0') {

      return false
    } else {
      return true
    }
  },[])

  const nextSelectAbleDate = useCallback((i, arr, length, a) => {
    const month = arr.slice(0, length)
    const month2 = month.slice(0, a)

    if(month2[i-1] === '0') {

      return false
    } else {
      return true
    }
  },[])

  // 달력에 보여줄 날짜 계산
  const getRenderDate = useCallback(() => {
    const { startDate, endDate } = monthDate
    const { startDay, endDay } = monthDay
    const arr = []
    const prevArr = []
    const nextArr = []
    const period = moment(endDate).diff(moment(startDate), "days");

    //해당 달에 대한 계산
    for(let i = 0; i <= period; i++) {
      let differencePeriod = moment(startDate).add(i, "d").format("YYYY-MM-DD");
      // date: 날짜, origin: 해당 월의 날짜 인지 판단, able: 예약 가능한 날짜 인지 판단
      arr.push({
        date: differencePeriod,
        origin: true,
        able: selectAbleDate(i)
      })
    }

    // 해당 달의 시작 요일 이전 날짜 계산
    for(let i = 1; i <= startDay; i++) {
      let pervPeriod = moment(startDate).add(-i, 'd').format('YYYY-MM-DD')
      // date: 날짜, origin: 해당 월의 날짜 인지 판단, able: 예약 가능한 날짜 인지 판단
      prevArr.unshift({
        date: pervPeriod,
        origin: false,
        able: prevSelectAbleDate(i, ableDateList.prev, monthLength.prevMonth, startDay)
      })
    }

    // 해당 달의 마지막 요일 이후의 날짜 계산
    for(let i = 1; i <= 6 - endDay; i++) {
      let nextPeriod = moment(endDate).add(i, 'd').format('YYYY-MM-DD')
      // date: 날짜, origin: 해당 월의 날짜 인지 판단, able: 예약 가능한 날짜 인지 판단
      nextArr.push({
        date: nextPeriod,
        origin: false,
        able: nextSelectAbleDate(i, ableDateList.next, monthLength.nextMonth, 6-endDay)
      })
    }

    // 달력 데이터 업데이트
    setDateArr([...prevArr, ...arr, ...nextArr])
  },[monthDate, monthDay, selectAbleDate, ableDateList, monthLength])

  // 상단 헤더 년도+날짜 계산
  const getStandardDate = useCallback(() => {
    const year = moment(TODAY).add(num, 'M').format('YYYY')
    const month = moment(TODAY).add(num, 'M').format('MM')

    const prevMonth = moment(`${year}-${month}`).add(-1, 'M').format(('YYYY-MM'))
    const nextMonth = moment(`${year}-${month}`).add(1, 'M').format(('YYYY-MM'))

    // 달력 헤더
    setStandard(`${year}년 ${month}월`)

    // 날짜 계산을 위한 dash 기준
    setDashStandard(`${year}-${month}`)
    setThreeMonth({
      prevMonth: prevMonth.split('-').join(''),
      currentMonth: `${year}${month}`,
      nextMonth: nextMonth.split('-').join('')
    })
  },[num, standard, dashStandard])

  const addMonth = useCallback(() => {
    setNum(num + 1)
  },[num])

  const minusMonth = useCallback(() => {
    setNum(num - 1)
  },[num])

  // 시작과 끝 날짜 사이 찾는 함
  const getMiddleDate = useCallback((startDate, date) => {
    const TYPE = localStorage.getItem('type')
    const arr = []
    if(TYPE === 'SPCL0003') {
      return
    } else {
      if(startDate >= date) {
        setMiddleDate([])
      } else {

        const period = moment(date).diff(moment(startDate), "days");
        for(let i = 1; i <= period - 1; i++) {
          let differencePeriod = moment(startDate).add(i, "d").format("YYYY-MM-DD");
          // date: 날짜, origin: 해당 월의 날짜 인지 판단, able: 예약 가능한 날짜 인지 판단
          arr.push(differencePeriod)
          setMiddleDate(arr)
        }
        return arr
      }
    }
  },[middleDate, selectDate])

  // 중간 날짜에 able false 찾는 함수
  const isFalseArr = useCallback((date) => {
    if(dateArr.length === 0) {
      return;
    } else {
      const bb = dateArr.filter(el => el.date === date)
      if(bb.length === 0){
        return;
      } else if(bb[0].able === false) {
        return false
      } else {
        return true
      }
    }
  },[dateArr])

  const findFalse = useCallback((arr) => {
    if(arr === undefined) {
      return []
    } else {
      const aa = []
      for(let i = 0; i < arr.length; i++) {
        aa.push(isFalseArr(arr[i]))
      }
      return aa
    }
  },[middleDate,selectDate])

  const getDate = useCallback((date, isOrigin, isAble) => {
    if(isAble) {
      const getUnableDateArr = getMiddleDate(selectDate.startDate, date)
      const getValue = findFalse(getUnableDateArr).includes(false)

      getSelectDate(date, getValue)
    } else {
      console.log(date)
    }
  },[selectDate, middleDate])

  const getSelectDate = useCallback((date, getValue) => {
    const TYPE = localStorage.getItem('type')
    const { startDate, endDate } = selectDate
    if(TYPE === 'SPCL0003') {
        getTimeList(date.split('-').join(''))
        setSelectDate({
          ...selectDate,
          startDate: date
        })
    } else {
      if(!startDate && !endDate) {
        setSelectDate({
          ...selectDate,
          startDate: date
        })
      } else if(startDate && !endDate) {
        // 역할: 시작 날짜와 끝 날짜 업데이트
        if(startDate > date) {
          setSelectDate({
            startDate: date,
            endDate: ''
          });
        } else {
          if(getValue) {
            alert('선택이 불가능한 일자가 포함되어있습니다.')
            setSelectDate({
              startDate: '',
              endDate: ''
            })
            setMiddleDate([])
          } else {
            setSelectDate({
              ...selectDate,
              endDate: date
            })
          }
        }
      } else if(startDate && endDate) {
        setMiddleDate([])
        setSelectDate({
          startDate: date,
          endDate: ''
        })
      }
    }


  },[selectDate, middleDate])

  // 모바일로 날짜 넘겨주는 부분
  const sendData = useCallback(async () => {
    const TYPE = localStorage.getItem('type')
    const { startDate, endDate, date, time } = selectDate
    let sendObject;
    if(TYPE === 'SPCL0001') {
      sendObject = {
        startDate: startDate,
        endDate: endDate,
        date: [startDate, ...middleDate],
        time: time === undefined ? [] : time,
        spaceId: localStorage.getItem('id'),
        osName: localStorage.getItem('os_name')
      }
    } else if(TYPE === 'SPCL0002') {
      const arr = endDate ? [startDate, ...middleDate, endDate] : [startDate]
      sendObject = {
        startDate: startDate,
        endDate: endDate,
        date: arr,
        time: time === undefined ? [] : time,
        spaceId: localStorage.getItem('id'),
        osName: localStorage.getItem('os_name')
      }
    } else if(TYPE === 'SPCL0003') {
      sendObject = {
        startDate: startDate,
        endDate: endDate,
        date: [startDate],
        time: time === undefined ? [] : time,
        spaceId: localStorage.getItem('id'),
        osName: localStorage.getItem('os_name')
      }
    }
    const config = {
      headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
    }
    try{
      const res = await axios.post(`http://15.165.17.192:8080/api/space/reserveNext/`, sendObject , config)
      console.log(res.status)
      if(res.status === 200) {
        if(localStorage.getItem('os_name') === 'AOS') {
          const code = '0'
          const startDate = res.data.data.startDate
          const endDate = res.data.data.endDate === '' ? '0' : res.data.data.endDate
          const firstTime = res.data.data.time[0] ? ARR.slice(res.data.data.time[0], res.data.data.time[0] + 1).join() : '0'
          const secondTime = res.data.data.time[1] ? ARR.slice(res.data.data.time[1], res.data.data.time[1] + 1).join() : '0'
          const thirdTime = res.data.data.time[2] ? ARR.slice(res.data.data.time[2], res.data.data.time[2] + 1).join() : '0'
          const spaceName = res.data.data.spaceName
          const totalPrice = String(res.data.data.totalPrice)

          const firstSelectTime = firstTime !== '0' ? (firstTime.split(':')[0] >= 9 && firstTime.split(':')[0] < 12 ? `오전 ${firstTime}` : `오후 ${firstTime}`) : '0'
          const secondSelectTime = secondTime !== '0' ? (secondTime.split(':')[0] >= 9 && secondTime.split(':')[0] < 12 ? `오전 ${secondTime}` : `오후 ${secondTime}`) : '0'
          const thirdSelectTime = thirdTime !== '0' ? (thirdTime.split(':')[0] >= 9 && thirdTime.split(':')[0] < 12 ? `오전 ${thirdTime}` : `오후 ${thirdTime}`) : '0'

          // console.log(firstSelectTime, secondSelectTime, thirdSelectTime)
          window.sendAndroid(code, startDate, endDate, firstSelectTime, secondSelectTime,thirdSelectTime, spaceName, totalPrice)
          // console.log("::::::",typeof code, typeof startDate,typeof  endDate, typeof firstSelectTime, typeof secondSelectTime,typeof thirdSelectTime, typeof spaceName, typeof totalPrice )
          // spacepayment.spacepaymentValue(code, startDate, endDate, firstSelectTime, secondSelectTime,thirdSelectTime, spaceName, totalPrice );
          localStorage.clear()
        } else if(localStorage.getItem('os_name') === 'IOS') {
          makeSendData(res.data.data)
        }
      }
    } catch (e) {
      // window.ReactNativeWebView.postMessage(JSON.stringify(e.response.statusText))
      console.log(e.response)
    }
  },[selectDate, middleDate])

  const makeSendData = (data) => {
    const timeList = data.time
    const aar = []
    if(timeList) {
      for(let i = 0; i < timeList.length; i++) {
        aar.push(...ARR.slice(timeList[i], timeList[i]+1))
      }
      data.time = aar
    }
    window.ReactNativeWebView.postMessage(JSON.stringify(data))
    localStorage.clear()
  }

  const getTimeList = useCallback(async (date) => {
    try {
      const res = await axios.get(`http://15.165.17.192:8080/api/space/reserveTime/${localStorage.getItem('id')}/${date}`,{
        headers: {
          Authorization: localStorage.getItem('token'),
          withCredentials: true
        }
      })
      setTimeSelectAbleList(res.data.data.timeList)
    } catch (e) {
      console.log(e)
    }
  },[selectDate])

  const getInitDate = useCallback(async () => {
    try {

      // alert(`getInitData ${localStorage.getItem('id')} // ${localStorage.getItem('token')}`)
      const res = await axios.get(`http://15.165.17.192:8080/api/space/reserveMonth/${localStorage.getItem('id')}/${threeMonth.currentMonth}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
          withCredentials: true
        }
      })
      setAbleDateList({
        prev: res.data.data.prev,
        selected: res.data.data.selected,
        next: res.data.data.next
      })
    } catch (e) {
      console.log(e, 'eeeee')
    }
  },[threeMonth, localStorage, ARR])

  useEffect(() => {
    getStandardDate()
  },[num])

  useEffect(() => {
    calculationDate()
  },[dashStandard])

  useEffect(() => {
    getRenderDate()
  },[monthDate, ableDateList])

  useEffect(() => {
    const { startDate, endDate, time } = selectDate
    const TYPE = localStorage.getItem('type')
    //type spcl0001 / 2 / 3
    if(TYPE === 'SPCL0001') {
      if(startDate && endDate) {
        setButtonDisable(false)
      } else {
        setButtonDisable(true)
      }
    } else if(TYPE === 'SPCL0002') {
      if(startDate) {
        setButtonDisable(false)
      } else {
        setButtonDisable(true)
      }
    } else if(TYPE === 'SPCL0003') {
      if(startDate && time.length > 0) {
        setButtonDisable(false)
      } else {
        setButtonDisable(true)
      }
    }

  },[selectDate, localStorage])


  // ======================================== api 통신 test ========================================

  useEffect(() => {
    getInitDate()
  },[threeMonth, localStorage])

  // ======================================== api 통신 test ========================================

  // 날짜 렌더 map 함수
  const renderDate = useCallback(() => {
    const getValue = findFalse(middleDate).includes(false)

    if(dateArr.length === 0 || dateArr === null) {
      return;
    } else {
      return dateArr.map((el, index) => {

        const isOrigin = el.origin && el.able ? '' : 'grayed'
        const isAble = el.origin && !el.able ? 'notAble' : ''
        const selected = selectDate.startDate === el.date ? 'selected' : ''
        const selected2 = selectDate.endDate === el.date ? 'selected' : ''
        const selected3 = middleDate.includes(el.date) && !getValue ? 'selected' : ''
        const able = el.able ? 'able' : ''

        const renderItem = String(el.date).slice(8, 10)

        return (
          <div className={`box ${isOrigin} ${isAble} ${selected} ${selected2} ${selected3}`} key={index} onClick={() => getDate(el.date, el.origin, el.able)}>
            <span className={`text`}>{renderItem}</span>
            <div className={`${able}`}></div>
          </div>
        )
      })
    }
  },[dateArr, selectDate, middleDate, ableDateList])

  const disabledStyle = buttonDisable ? 'disable' : ''


  // ======================================================
  return (
    <div className="Calendar" ref={mainCalendar}>
      <div className="head">
        <button onClick={minusMonth}><MdChevronLeft /></button>
        <span className="title">{standard}</span>
        <button onClick={addMonth}><MdChevronRight /></button>
      </div>
      <div className="body">
        <div className="row">
          <div className="box">
            <span className="text">일</span>
          </div>
          <div className="box">
            <span className="text">월</span>
          </div>
          <div className="box">
            <span className="text">화</span>
          </div>
          <div className="box">
            <span className="text">수</span>
          </div>
          <div className="box">
            <span className="text">목</span>
          </div>
          <div className="box">
            <span className="text">금</span>
          </div>
          <div className="box">
            <span className="text">토</span>
          </div>
        </div>
        <div className="row">
          {renderDate()}
        </div>
      </div>
      {localStorage.getItem('type') === 'SPCL0003' ? (
        <TimeTable ARR={ARR} ABLE_LIST={timeSelectAbleList} selectDate={selectDate} setSelectDate={setSelectDate}/>
      ) : null}


      <div className='confirmButtonBox'>
        <button className={`confirmButton ${disabledStyle}`} disabled={buttonDisable} onClick={sendData}>다음</button>
      </div>

    </div>
  )
}

export default Calendar