import React from 'react'
import { motion } from 'framer-motion'

export const Landingpage = () => {
  return (
    <>
    <div className='flex justify-center items-center h-screen bg-[#202626] w-[100%]'>
        <div className='flex justify-center items-center w-full'>
          <motion.img
            src="https://spin.axiomthemes.com/splash/src/img/hero/banner.png"
            alt="Middle image"
            className='h-90 max-w-full object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
         
        

        </div>
    </div>
    </>
  )
}
