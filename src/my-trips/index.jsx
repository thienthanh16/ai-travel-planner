import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate, useNavigation } from 'react-router-dom';
import UserTripCardItem from './component/UserTripCardItem';
import Footer from '@/view-trip/components/Footer';

function MyTrips() {
    const navigation = useNavigation([]);
    const [userTrips,setUserTrips]=useState([]);
    useEffect(() => {
        GetUserTrips();
    }, [])
    const GetUserTrips =async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user) {
            navigation('/');
            return;
        }
        
        const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email));
        const querySnapshot = await getDocs(q);
        setUserTrips([]);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            setUserTrips(preVal=>[...preVal,doc.data()])
        });
    }

    return (
        <div className='sm:px-10 mt-10 md:px-32 lg:px-56 xl:px-72 px-5 gap-5'>
            <h2 className='font-bold text-3xl'>My Trips</h2>

            <div className='grid grid-cols-2 md:grid-cols-3 mt-10 gap-3'>
                {userTrips?.length>0?userTrips.map((trip,index)=>(
                    <UserTripCardItem trip={trip} />
                ))
                :[1,2,3,4,5,6].map((item,index)=>(
                    <div key={index} className='h-[220px] w-full bg-slate-200 animate-pulse rounded-xl'>

                    </div>
                ))
                }
            </div>
            <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
                <Footer/>
            </div>
        </div>
    )
}

export default MyTrips
