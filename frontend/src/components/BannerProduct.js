import React, { useEffect, useState } from "react";
import image1 from "../assest/banner/image1.jpg";
import image2 from "../assest/banner/image2.jpg";
import image3 from "../assest/banner/image3.png";

import imageMobile1 from "../assest/banner/image_mobile1.png";
import imageMobile2 from "../assest/banner/image_mobile2.png";

import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";


const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const desktopImage = [image1, image2, image3];
  const mobileImage = [imageMobile1, imageMobile2];

  const nextImage = () =>{
    if(desktopImage.length - 1 > currentImage){
        setCurrentImage(preve => preve + 1)
    }
}

const preveImage = () =>{
    if(currentImage !== 0){
        setCurrentImage(preve => preve - 1)
    }
}

useEffect(()=>{
    const interval = setInterval(()=>{
        if(desktopImage.length - 1 > currentImage){
            nextImage()
        }else{
            setCurrentImage(0)
        }
    },5000)

    return ()=> clearInterval(interval)
},[currentImage])

  return (
    <div className="container mx-auto px-4 rounded">
      <div className="h-60 md:h-72 bg-purple-100 relative">

        <div className="absolute z-10 w-full h-full md:flex items-center hidden">
          <div className="flex justify-between w-full text-3xl">
            <button className="bg-purple-100 rounded-full p-1 shadow-md" onClick={preveImage}><FaAngleLeft /></button>
            <button className="bg-purple-100 rounded-full p-1 shadow-md" onClick={nextImage}><FaAngleRight /></button>
          </div>
          
        </div>
        <div className="hidden md:flex h-full w-full overflow-hidden">
          {desktopImage.map((imageUrl, index) => {
            return (
              <div
                className="w-full h-full min-w-full min-h-full transition-all"
                key={imageUrl}
                style={{ transform: `translateX(-${currentImage * 100}%)` }}
              >
                <img
                  src={imageUrl}
                  className="w-full h-full"
                  alt="banner one"
                />
              </div>
            );
          })}
        </div>
        {/*Mobile */}
        <div className="flex h-full w-full overflow-hidden md:hidden">
          {mobileImage.map((imageUrl, index) => {
            return (
              <div
                className="w-full h-full min-w-full min-h-full transition-all"
                key={imageUrl}
                style={{ transform: `translateX(-${currentImage * 100}%)` }}
              >
                <img
                  src={imageUrl}
                  className="w-full h-full"
                  alt="banner one"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BannerProduct;
