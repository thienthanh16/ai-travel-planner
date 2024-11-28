import Footer from '@/view-trip/components/Footer'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function UserTripCardItem({trip}) {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (!trip?.userSelection?.location?.formattedAddress) {
          setImageUrl('https://via.placeholder.com/220x220?text=No+Image');
          return;
        }

        const location = trip.userSelection.location.formattedAddress || 'travel';
        const API_KEY = '';
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
    <Link to={'/view-trip/'+trip?.id}>
        <div className='hover:scale-105 transition-all '>
        <img src={imageUrl} className='object-cover rounded-xl h-[220px]' />

        <div>
            <h2 className='font-bold text-lg'>{trip?.userSelection?.location?.formattedAddress}</h2>
            <h2 className='text-sm text-gray-500'>{trip?.userSelection?.noOfDays} Days trip with {trip?.userSelection?.budget}$ Budget</h2>
        </div>
        </div>
    </Link>
    
  )
}

export default UserTripCardItem
