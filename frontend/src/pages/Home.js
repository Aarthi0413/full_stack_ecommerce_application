import React from 'react'
import CategoryList from '../components/CategoryList'
import HorizontalCartProduct from '../components/HorizontalCartProduct'
import VerticalCartProduct from '../components/VerticalCartProduct'

const Home = () => {
  return (
    <div>
      <CategoryList/>
      <VerticalCartProduct category={"play-station"} heading={"Play Station"}/>
      <VerticalCartProduct category={"table-lamps"} heading={"Table-Lamps"}/>
      <VerticalCartProduct category={"blankets"} heading={"Blankets"}/>
      <VerticalCartProduct category={"sofa"} heading={"Sofa's"}/>
      <VerticalCartProduct category={"bangles"} heading={"Bangles"}/>
      <HorizontalCartProduct category={"earphones"} heading={"Earphones"}/>
    </div>
  )
}

export default Home