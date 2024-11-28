import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from './Footer'
import { Button } from '@/components/ui/button'

function Hotels({trip}) {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (!trip?.userSelection?.hotelName) {
          setImageUrl('https://via.placeholder.com/220x220?text=No+Image');
          return;
        }

        const location = trip.userSelection.hotelName || 'travel';
        const API_KEY = '46101265-d8204c525f82e255e7960ecb4';
        const response = await fetch(
          `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(location)}&image_type=photo&per_page=5`
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data?.hits?.length > 0) {
          setImageUrl(data.hits[0].webformatURL);
        } else {
          setImageUrl('https://via.placeholder.com/220x220?text=No+Image');
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        setImageUrl('https://via.placeholder.com/220x220?text=Error+Loading+Image');
      }
    };

    fetchImage();
  }, [trip]);

  return (
    <div>
      <h2 className='font-bold text-xl mt-5'>Hotels Recommendation</h2>

      <div className='grid grid-cols-2 md:grid-cols-4 xl:grid-col-4 gap-5 mt-5'>
        {trip?.tripData?.hotelOptions?.map((hotel,index)=>(
            <Link to={'https://www.google.com/maps/search/?api=1&query='+hotel?.hotelName+ "," +hotel?.hotelAddress} target='_blank'>
                <div className='hover:scale-105 transition-all cursor-pointer'>
                    <img src={imageUrl} className='rounded-xl' />
                    <div className='my-2 flex flex-col gap-2'>
                        <h2 className='font-medium'>{hotel.hotelName}</h2>
                        <h2 className='text-xs text-gray-500'>🚩 {hotel.hotelAddress}</h2>
                        <h2 className='text-sm'>💵 {hotel?.price}</h2>
                        <h2 className='text-sm'>⭐ {hotel?.rating}</h2>
                    </div>
                </div>
            </Link>
            
        ))}
        
      </div>
      
    </div>
    
  )
}

export default Hotels
