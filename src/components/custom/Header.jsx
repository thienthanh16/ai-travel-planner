import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [openDailog, setOpenDailog] = useState(false);
  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  })

 

  useEffect(() => {
    console.log(user)
  }, [])

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
      window.location.reload();
    })
  }

  

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5 bg-blue-50'>
      <a href='/'>
        <img className='w-[120px] cursor-pointer' src='/logo.svg' />
      </a>
      <div>
        {user ?
          <div className='flex items-center gap-5'>
            <a href='/create-trip'><Button varient='outline' className='rounded-full'>➕ Create Trip</Button></a>
            <a href='/my-trips'><Button varient='outline' className='rounded-full'>My Trips</Button></a>
            <Popover>
              <PopoverTrigger>
                <img src={user?.picture} className='h-[35px] w-[35px] rounded-full' />
              </PopoverTrigger>
              <PopoverContent>
                <h2 onClick={()=>{
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                }} className='cursor-pointer'>Log out</h2>
              </PopoverContent>
            </Popover>

          </div>
          :
          <Button onClick={()=>setOpenDailog(true)}>Sign In</Button>
        }

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
    </div>
  )
}

export default Header
