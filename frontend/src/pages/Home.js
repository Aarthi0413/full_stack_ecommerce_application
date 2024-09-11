import React from 'react'
import CategoryList from '../components/CategoryList'
import HorizontalCartProduct from '../components/HorizontalCartProduct'
import VerticalCartProduct from '../components/VerticalCartProduct'

const Home = () => {
  return (
    <div>
      <CategoryList/>
      {/* <BannerProduct/> */}
      <HorizontalCartProduct category={"table-lamps"} heading={"Popular Table-Lamps"}/>
      <HorizontalCartProduct category={"airpods"} heading={"Top Airpods"}/>
      <VerticalCartProduct category={"blankets"} heading={"Trending Watches"}/>
      <VerticalCartProduct category={"speakers"} heading={"Bluetooth Speakers"}/>
      <VerticalCartProduct category={"earphones"} heading={"Popular Mobiles"}/>
      <VerticalCartProduct category={"watches"} heading={"Best Smart Watches"}/>
      <VerticalCartProduct category={"televisions"} heading={"Televisions"}/>
    </div>
  )
}

export default Home