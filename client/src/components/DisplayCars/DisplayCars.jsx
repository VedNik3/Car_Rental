// import React from 'react'
import Navbar from "../Navbar"
import CardContainer from './CardContainer'
import FilterCar from "./FilterCar"
import Modify from './Modify'

const DisplayCars = () => {
  return (
    <div className="bg-gray-200 h-[100vh]">
      <Navbar/>
      <div className='flex'>
      <FilterCar/>
      <div className="ml-80">
      <Modify/>
      <CardContainer/>
      </div>
      </div>
    </div>
  )
}

export default DisplayCars
