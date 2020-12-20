import React, { useState, useEffect } from 'react'
import './calendar.scss'
import moment from "moment";
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';


const TODAY = moment().format('YYYY-MM-DD')
const CUREENT_MONTH = moment().format('YYYY-MM')

const Calendar = () => {

  // 선택된 시작날짜와 마지막 날짜
  const [selectDate, setSelectDate] = useState({
    startDate: '',
    endDate: ''
  })

  // 한달 시작과 끝 날짜
  const [monthDate, setMonthDate] = useState({
    startDate: moment(`${CUREENT_MONTH}-01`).format('YYYY-MM-DD'),
    endDate: moment(`${CUREENT_MONTH}-01`).add(1, 'M').add(-1, 'd').format('YYYY-MM-DD')
  })
  const [monthDay, setMonthDay] = useState({
    startDay: moment(`${CUREENT_MONTH}-01`).day(),
    endDay: moment(`${CUREENT_MONTH}-01`).add(1, 'M').add(-1, 'd').day()
  })

  // 날짜 계산을 위한 덧셈 뺄셈 숫자
  const [ num, setNum ] = useState(0)

  // 헤더 년 월
  const [standard, setStandard] = useState('')

  // 날짜 계산을 위한 기준 년 월 일
  const [dashStandard, setDashStandard] = useState('')

  // 날짜 모을 배열
  const [dateArr, setDateArr] = useState([])

  const test = () => {
    const { startDate, endDate } = monthDate
    const { startDay, endDay } = monthDay
    const arr = []
    const prevArr = []
    const nextArr = []
    const period = moment(endDate).diff(moment(startDate), "days");
    for(let i = 0; i <= period; i++) {
      let differencePeriod = moment(startDate).add(i, "d").format("DD");
      arr.push(differencePeriod)
    }

    for(let i = 1; i <= startDay; i++) {
      let pervPeriod = moment(startDate).add(-i, 'd').format('DD')
      prevArr.unshift(pervPeriod)
    }

    for(let i = 1; i <= 6 - endDay; i++) {
      let nextPeriod = moment(endDate).add(i, 'd').format('DD')
      nextArr.push(nextPeriod)
    }

    setDateArr([...prevArr, ...arr, ...nextArr])
  }

  // 상단 헤더 년도+날짜 계산
  const getStandardDate = () => {
    const year = moment(TODAY).add(num, 'M').format('YYYY')
    const month = moment(TODAY).add(num, 'M').format('MM')
    setStandard(`${year}년 ${month}월`)
    setDashStandard(`${year}-${month}`)
  }

  const addMonth = () => {
    setNum(num + 1)
  }

  const minusMonth = () => {
    setNum(num - 1)
  }

  useEffect(() => {
    getStandardDate()
  },[num])

  useEffect(() => {
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
  },[dashStandard])

  useEffect(() => {
    test()
  },[monthDate])

  const getDate = (date, string1, string2) => {
    if(string1 || string2) {
      return;
    } else {
      getSelectDate(date)
    }
  }

  const getSelectDate = (date) => {
    const { startDate, endDate } = selectDate
    if(!startDate && !endDate) {
      setSelectDate({
        ...selectDate,
        startDate: date
      })
    } else if(startDate && !endDate) {
      if(startDate > date) {
        console.log('클수업서여')
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
  }

  console.log(selectDate)

  const renderDate = () => {
    return dateArr.map((el, index) => {
      const dashDate = index < monthDay.startDay  || index >= (dateArr.length - (6 - monthDay.endDay))? el : `${dashStandard}-${el}`
      const dashDate2 = index >= (dateArr.length - (6 - monthDay.endDay)) ? el : `${dashStandard}-${el}`
      console.log(dashDate,'ddd')
      // console.log(dashDate2, 'dd')
      const grayed = index < monthDay.startDay ? 'grayed' : ''
      const grayed2 = index >= (dateArr.length - (6 - monthDay.endDay)) ? 'grayed' : ''
      const selected = selectDate.startDate === dashDate ? 'selected' : ''
      const selected2 = selectDate.endDate === dashDate ? 'selected' : ''
      // console.log(grayed2)
        return (
            <div className={`box ${grayed} ${grayed2} ${selected} ${selected2}`} key={index} onClick={() => getDate(`${dashStandard}-${el}`, grayed, grayed2)}>
              <span className={`text`}>{el}</span>
            </div>
        )
    })
  }

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