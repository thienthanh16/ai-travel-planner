import { Button } from '@/components/ui/button'
import React, { useState, useEffect } from 'react'
import { IoLocation } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function PlaceCardItem({place}) {
  const [imageUrl, setImageUrl] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (!place?.placeName) {
          setImageUrl('https://via.placeholder.com/220x220?text=No+Image');
          return;
        }

        const location = place.placeName || 'travel';
        const API_KEY = '';
        const response = await fetch(
          `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(location)}&image_type=photo&per_page=10`
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
  }, [place]);

  // Hàm xử lý sự kiện onClick
  const handleCardClick = () => {
    navigate(`/place-details/${encodeURIComponent(place.placeName)}`); 
  };

  return (
    //<Link to={'https://www.google.com/maps/search/?api=1&query=' + place?.placeName + "," + place?.geoCoordinates} target='_blank'>
        <div className='border  rounded-xl p-3 mt-3 flex gap-5 ' >
        <img src={imageUrl} className='h-[150px] w-[150px] rounded-xl hover:scale-105 transition-all hover:shadow-md cursor-pointer' onClick={handleCardClick}/>

        <div>
            <h2 className='font-bold text-lg'>{place.placeName}</h2>
            <p className='text-sm text-gray-500'>{place.placeDetails}</p>
            <h2 className='mt-2'>🎫Ticket: {place.ticketPricing}</h2>
            <Link to={'https://www.google.com/maps/search/?api=1&query=' + place?.placeName + "," + place?.geoCoordinates} target='_blank'>
              <Button size='sm' className='mt-2'><IoLocation /></Button>
            </Link>
        </div>
        </div>
    //</Link>
  )
}

export default PlaceCardItem
