import React, { useState, useEffect, useCallback } from 'react'
import './calendar.scss'
import moment from "moment";
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

// 오늘 날짜
const TODAY = moment().format('YYYY-MM-DD')
// 오늘 년 월
const CUREENT_MONTH = moment().format('YYYY-MM')

// api 호출 전 dummy 데이터
const list= ["0", "0", "0", "0", "1", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "1", "0", "0", "0", "0", "0", "0", "0", "1", "0", "0", "0", "0", "0", "0", "0"]

const Calendar = () => {

  // 선택된 시작 날짜와 마지막 날짜
  const [selectDate, setSelectDate] = useState({
    startDate: '',
    endDate: ''
  })

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
      let differencePeriod = moment(startDate).add(i, "d").format("DD");
      // date: 날짜, origin: 해당 월의 날짜 인지 판단, able: 예약 가능한 날짜 인지 판단
      arr.push({
        date: differencePeriod,
        origin: true,
        able: selectAbleDate(i)
      })
    }

    // 해당 달의 시작 요일 이전 날짜 계산
    for(let i = 1; i <= startDay; i++) {
      let pervPeriod = moment(startDate).add(-i, 'd').format('DD')
      // date: 날짜, origin: 해당 월의 날짜 인지 판단, able: 예약 가능한 날짜 인지 판단
      prevArr.unshift({
        date: pervPeriod,
        origin: false,
        able: false
      })
    }

    // 해당 달의 마지막 요일 이후의 날짜 계산
    for(let i = 1; i <= 6 - endDay; i++) {
      let nextPeriod = moment(endDate).add(i, 'd').format('DD')
      // date: 날짜, origin: 해당 월의 날짜 인지 판단, able: 예약 가능한 날짜 인지 판단
      nextArr.push({
        date: nextPeriod,
        origin: false,
        able: false
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

  const getDate = useCallback((date, isOrigin, isAble) => {
    if(isAble) {
      getSelectDate(date)
    } else {
      console.log(date)
    }
  },[selectDate])

  const getSelectDate = useCallback((date) => {
    const { startDate, endDate } = selectDate
    if(!startDate && !endDate) {
      setSelectDate({
        ...selectDate,
        startDate: date
      })
    } else if(startDate && !endDate) {
      if(startDate > date) {
        return;
      } else {
        setSelectDate({
          ...selectDate,
          endDate: date
        })
      }

    } else if(startDate && endDate) {
      setSelectDate({
        startDate: date,
        endDate: ''
      })
    }
  },[selectDate])

  const makeDate = useCallback((index, date) => {
    const year = moment(TODAY).add(num, 'M').format('YYYY')
    const prevYear = moment(year).add(-1, 'y').format('YYYY')
    const nextYear = moment(year).add(1, 'y').format('YYYY')

    const month = moment(TODAY).add(num, 'M').format('MM')
    const prevMonth = moment(month).add(-1, 'M').format('MM')
    // const nextMonth = moment(month).add(1, 'm').format('MM')
    const nextMonth = moment(month).add(1, 'M').format('MM')
    // console.log(nextMonth)

    if(index < monthDay.startDay) {
      if(month === '01') {
        return `${prevYear}-${prevMonth}-${date}`
      } else {
        return `${year}-${prevMonth}-${date}`
      }
    } else if(index >= (dateArr.length - (6 - monthDay.endDay))) {
      if(month === '12') {
        return `${nextYear}-${nextMonth}-${date}`
      } else {
        return `${year}-${nextMonth}-${date}`
      }
    } else {
      return `${dashStandard}-${date}`
    }
  },[monthDay, dashStandard])

  useEffect(() => {
    getStandardDate()
  },[num])

  useEffect(() => {
    calculationDate()
  },[dashStandard])

  useEffect(() => {
    getRenderDate()
  },[monthDate])

  // 날짜 렌더 map 함수
  const renderDate = useCallback(() => {
    if(dateArr.length === 0 || dateArr === null) {
      return;
    } else {
      return dateArr.map((el, index) => {
        // const dashDate = index < monthDay.startDay  || index >= (dateArr.length - (6 - monthDay.endDay))? el.date : `${dashStandard}-${el.date}`
        const dashDate = makeDate(index, el.date)
        const isOrigin = el.origin && el.able ? '' : 'grayed'
        const isAble = el.origin && !el.able ? 'notAble' : ''
        const selected = selectDate.startDate === dashDate ? 'selected' : ''
        const selected2 = selectDate.endDate === dashDate ? 'selected' : ''
        const able = el.able ? 'able' : ''

        return (
          <div className={`box ${isOrigin} ${isAble} ${selected} ${selected2}`} key={index} onClick={() => getDate(dashDate, el.origin, el.able)}>
            <span className={`text`}>{el.date}</span>
            <div className={`${able}`}></div>
          </div>
        )
      })
    }
  },[dateArr, selectDate])

  return (
    <div className="Calendar">
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
    </div>
  )
}

export default Calendar