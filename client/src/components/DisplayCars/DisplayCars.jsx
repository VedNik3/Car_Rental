// import React from 'react'
import Navbar from "../Navbar"
import CardContainer from './CardContainer'
import FilterCar from "./FilterCar"
import Modify from './Modify'

const DisplayCars = () => {
  return (
    <div>
      <Navbar/>
      <div className='flex'>
      <FilterCar/>
      <div>
      <Modify/>
      <CardContainer/>
      </div>
      </div>
    </div>
  )
}

export default DisplayCars
