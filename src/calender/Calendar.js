import React, { useState, useEffect, useCallback, useRef } from 'react'
import './calendar.scss'
import moment from "moment";
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import axios from 'axios'

// 오늘 날짜
const TODAY = moment().format('YYYY-MM-DD')
// 오늘 년 월
const CUREENT_MONTH = moment().format('YYYY-MM')

// api 호출 전 dummy 데이터
const list= ["1", "1", "1", "1", "1", "1", "0", "0", "0", "1", "1", "0", "0", "0", "1", "1", "1", "1", "1", "1", "1", "1", "1", "0", "0", "1", "1", "1", "1", "1", "1"]

const Calendar = () => {

  const mainCalendar = useRef(null)
  const [ token, setToken ] = useState('')
  // 선택된 시작 날짜와 마지막 날짜
  const [selectDate, setSelectDate] = useState({
    startDate: '',
    endDate: ''
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

  // 날짜 계산을 위한 덧셈 뺄셈 숫자
  const [ num, setNum ] = useState(0)

  // 달력 제목 년 월
  const [standard, setStandard] = useState('')

  // 날짜 계산을 위한 기준 년 월 일
  const [dashStandard, setDashStandard] = useState('')

  // 모든 날짜를 넣는 배열
  const [dateArr, setDateArr] = useState([])

  // 날짜 계산
  const calculationDate = useCallback(() => {
    const startMonth = moment(`${dashStandard}-01`).format('YYYY-MM-DD')
    const startDay = moment(startMonth).day()

    const endMonth = moment(`${dashStandard}-01`).add(1, 'M').add(-1, 'd').format('YYYY-MM-DD')
    const endDay = moment(endMonth).day()

    setMonthDate({
      startDate: startMonth,
      endDate: endMonth
    })
    setMonthDay({
      startDay: startDay,
      endDay: endDay
    })
  },[dashStandard, monthDate, monthDay])

  // 예약 가능 날짜 판단
  const selectAbleDate = useCallback((i) => {
    if (list[i] === '0') {
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
        able: true
      })
    }

    // 해당 달의 마지막 요일 이후의 날짜 계산
    for(let i = 1; i <= 6 - endDay; i++) {
      let nextPeriod = moment(endDate).add(i, 'd').format('YYYY-MM-DD')
      // date: 날짜, origin: 해당 월의 날짜 인지 판단, able: 예약 가능한 날짜 인지 판단
      nextArr.push({
        date: nextPeriod,
        origin: false,
        able: true
      })
    }

    // 달력 데이터 업데이트
    setDateArr([...prevArr, ...arr, ...nextArr])
  },[monthDate, monthDay, selectAbleDate])

  // 상단 헤더 년도+날짜 계산
  const getStandardDate = useCallback(() => {
    const year = moment(TODAY).add(num, 'M').format('YYYY')
    const month = moment(TODAY).add(num, 'M').format('MM')
    // 달력 헤더
    setStandard(`${year}년 ${month}월`)

    // 날짜 계산을 위한 dash 기준
    setDashStandard(`${year}-${month}`)
  },[num, standard, dashStandard])

  const addMonth = useCallback(() => {
    setNum(num + 1)
  },[num])

  const minusMonth = useCallback(() => {
    setNum(num - 1)
  },[num])

  // 시작과 끝 날짜 사이 찾는 함
  const getMiddleDate = useCallback((startDate, date) => {
    const arr = []
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

    const { startDate, endDate } = selectDate

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
          setSelectDate({
            startDate: '',
            endDate: ''
          })
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
  },[selectDate, middleDate])

  useEffect(() => {
    getStandardDate()
  },[num])

  useEffect(() => {
    calculationDate()
  },[dashStandard])

  useEffect(() => {
    getRenderDate()
  },[monthDate])


  // 모바일로 날짜 넘겨주는 부분
  const sendData = useCallback(() => {
    window.ReactNativeWebView.postMessage(JSON.stringify(selectDate))
  },[selectDate])


  // ======================================== api 통신 test ========================================
  const [data, setData] = useState([])
  const getInitData = async () => {
    try {
      const res = axios.get('http://15.165.17.192:8080/api/space/reserveMonth/SPAC00000001/202012', {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJNRU1CMDAwMDAwMDEiLCJpYXQiOjE2MDg2MzE4NjcsImV4cCI6MTYwODY2MTg2N30.0W1jhgVTq50OO4QISRrU-caxngTrZFFEQVX6nZ_nS_k',
          withCredentials: true
        }
      })
      setData(res)
      console.log(res)
    } catch (e) {
      console.log(e, 'eeeee')
    }
  }

  useEffect(() => {
    getInitData()
  },[])
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
  },[dateArr, selectDate, middleDate])

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
      <button onClick={sendData}>버트은</button>
    </div>
  )
}

export default Calendar