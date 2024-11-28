import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import Footer from '@/view-trip/components/Footer'

function Hero() {
  const [userSelection] = useState();

  return (
    <div className='items-center mx-56 gap-9 flex-col flex '>
      <h1
        className='font-extrabold text-[50px] text-center mt-16 '
      ><span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span> Personalized Itineraries at Your Fingertips</h1>
      <p className='text-xl text-gray-500 text-center mt-16'>Your personal trip planner and travel curator,creating custom itineraries tailored to your interests and budget.</p>
      <Link to={'/create-trip'}>
        <Button>Get Started</Button>
      </Link>

      

      <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
        <Footer />
      </div>
    </div>

  )
}

export default Hero
