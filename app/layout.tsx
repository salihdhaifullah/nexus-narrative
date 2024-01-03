"use client"

import { Aleo } from 'next/font/google'
import Provider from '../context'
import Wrapper from '@/components/layout/Wrapper'
import './globals.css'

const aleo = Aleo({
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap'
})

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className='flex flex-col bg-gray-100 dark:bg-gray-900 min-h-[100vh]'>
      <body className={aleo.className}>
          <Provider>
            <Wrapper>
              {children}
            </Wrapper>
          </Provider>
      </body>
    </html>
  );
}

export default RootLayout
