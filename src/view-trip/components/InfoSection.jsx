import React, { useEffect, useState } from 'react'
import { IoIosSend } from "react-icons/io";
import { Button } from '@/components/ui/button';


function InfoSection({trip}) {

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (!trip?.userSelection?.location?.formattedAddress) {
          setImageUrl('https://via.placeholder.com/220x220?text=No+Image');
          return;
        }

        const location = trip.userSelection.location.formattedAddress || 'travel';
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
      <img src={imageUrl} className='h-[500px] w-full object-cover rounded-xl' />
      <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-2'>
            <h2 className='font-bold text-2xl'>{trip?.userSelection?.location?.formattedAddress}</h2>
            <div className='flex gap-5'>
                <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 '>📅 {trip?.userSelection?.noOfDays} Day</h2>
                <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 '>💸 {trip?.userSelection?.budget}$ Budget</h2>
                <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 '>🥂 Number of Traveler: {trip?.userSelection?.traveler} </h2>
            </div>
        </div>
        <Button><IoIosSend /></Button>
      </div>
      
    </div>
  )
}

export default InfoSection
