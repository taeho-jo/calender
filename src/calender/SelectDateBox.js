import React from 'react'
import './selectDateBox.scss'

const SelectDateBox = ({type, selectDate}) => {
  console.log(type)
  return (
      <div className='mainContainer'>
        <div className='timeBox'>
          <div className='box'>
            <span className='boxTitle'>시작시간 : </span>
            <span>{selectDate.startDate}</span>
          </div>
          <div className='box'>
            <span className='boxTitle'>종료시간 : </span>
            <span>{type === 'SPCL0001' ? selectDate.endDate : selectDate.endDate ? selectDate.endDate : selectDate.startDate}</span>
          </div>
        </div>
      </div>
  )
}

export default SelectDateBox