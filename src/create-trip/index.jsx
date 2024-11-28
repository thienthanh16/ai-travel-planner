import React, { useEffect, useState } from 'react'
import AutocompleteSearch from './autocompleteSearch';
import { Input } from "@/components/ui/input"
import { AI_PROMPT, SelectBudgetOptions } from '@/constant/options';
import { SelectTravelList } from '@/constant/options';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { chatSession } from '@/service/AiModel';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { useNavigate, useNavigation } from 'react-router-dom';
import Footer from '@/view-trip/components/Footer';



function CreateTrip() {
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [selectedLocation, setSelectedLocation] = useState([]);

  const [openDailog, setOpenDailog] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate=useNavigate();

  // Hàm này được truyền vào AutocompleteSearch để lấy dữ liệu về
  const handleLocationSelect = (name, value) => {
    setSelectedLocation((selectedLocation) => ({
      ...selectedLocation,
      [name]: value
    }))

  }

  const data = {
    location: {
      city: selectedLocation?.location,
      formattedAddress: selectedLocation?.location,
    },
    noOfDays: selectedLocation?.noOfDays,
    budget: selectedLocation?.budget,
    traveler: selectedLocation?.traveler
  };
  

  useEffect(() => {
    console.log(selectedLocation);
  }, [selectedLocation])

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  })

  const onGenerateTrip = async () => {
    const user = localStorage.getItem('user');

    if (!user) {
      setOpenDailog(true);
      return;
    }

    if (selectedLocation?.noOfDays > 5 && !selectedLocation?.location || !selectedLocation?.budget || !selectedLocation?.traveler) {
      toast("Please fill all details!");
      return;
    }

    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', selectedLocation?.location)
      .replace('{totalDays}', selectedLocation?.noOfDays)
      .replace('{traveler}', selectedLocation?.traveler)
      .replace('{budget}', selectedLocation?.budget)
      .replace('{totalDays}', selectedLocation?.noOfDays)

    const result = await chatSession.sendMessage(FINAL_PROMPT);

    console.log('--', result?.response?.text());
    setLoading(false);
    saveAiTrip(result?.response?.text());
  }

  const saveAiTrip = async (TripData) => {
    setLoading(true);

    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString()
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: data,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId
    });
    setLoading(false);
    navigate('/view-trip/'+docId)
  }

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?acess_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDailog(false);
      onGenerateTrip();
    })
  }

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences 🌍✈️🌴</h2>
      <p className='mt-3 text-gray-500 text-xl'>Just provide some basic information,and our trip planner will generate a customized itinerary based on your preferences.</p>

      <div className='mt-20 flex flex-col gap-10'>
        <div>
          <h2 className='text-xl my-3 font-medium'>What is destination of choice?</h2>
          {/*<AutocompleteSearch
            onLocationSelect={(location) => handleLocationSelect('location', location)}
          />*/}
          <Input placeholder={'Ex. Can Tho - Chau Doc'} type='text' className='border-[2px]'
          onChange={(e) => handleLocationSelect('location', e.target.value)}
        />
        </div>
        <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
        <Input placeholder={'Ex.3'} type='number' className='border-[2px]'
          onChange={(e) => handleLocationSelect('noOfDays', e.target.value)}
        />

        <h2 className='text-xl my-3 font-medium'>What is Your Budget?</h2>
        <Input placeholder={'Ex.1000$'} type='text' className='border-[2px]'
          onChange={(e) => handleLocationSelect('budget', e.target.value)}
        />
        {/*<div className='grid grid-cols-3 gap-5 mt-5'>
          {SelectBudgetOptions.map((item, index) => (
            <div key={index}
              onClick={() => handleLocationSelect('budget', item.title)}
              className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer
              ${selectedLocation?.budget == item.title && 'shadow-lg border-black'}`}
            >
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>*/}

        <h2 className='text-xl my-3 font-medium'>Who do you plan on traveling with on your next adventure?</h2>
        <div className='grid grid-cols-3 gap-5 mt-5'>
          {SelectTravelList.map((item, index) => (
            <div key={index}
              onClick={() => handleLocationSelect('traveler', item.people)}
              className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer
              ${selectedLocation?.traveler == item.people && 'shadow-lg border-black'}`}>
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>

      </div>
      <div className='my-10 justify-end flex'>
        <Button
          disable={loading}
          onClick={onGenerateTrip}>
          {loading ?
            <AiOutlineLoading3Quarters className='w-7 h-7 animate-spin' /> : 'Generate Trip'

          }
        </Button>
      </div>
      
      <Dialog open={openDailog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src='/logo.svg' />
              <h2 className='font-bold text-lg mt-7'>Sign in with Google</h2>
              <p>Sign In to the App with Google authentication securely</p>
              <Button

                onClick={login}
                className='w-full mt-5 flex gap-4'>

                <FcGoogle className='h-7 w-7' />
                Sign In With Google

              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      
      <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
          <Footer/>
      </div>
    </div>
  )
}

export default CreateTrip
