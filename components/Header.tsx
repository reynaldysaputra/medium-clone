import Link from 'next/link';
import React from 'react';

function Header(params: any) {
  return(
    <header className='flex justify-between p-5 max-w-5xl mx-auto'>
      <div className='flex items-center space-x-4'>
        <Link href='/'>
          <img 
            className='w-44 object-contain cursor-pointer'
            src="https://links.papareact.com/yvf" 
          />
        </Link>
        <div className='hidden md:flex items-center space-x-5'>
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className='bg-green-600 text-white px-4 py-1 rounded-full'>Follow</h3>
        </div>
      </div>

      <div className='flex items-center text-green-600 space-x-5'>
        <h3>Sign In</h3>
        <h3 className='border px-4 py-1 rounded-full border-green-600'>Get Started</h3>
      </div>
    </header>
  )
}

export default Header;