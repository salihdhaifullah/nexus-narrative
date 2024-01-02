import type { Metadata } from 'next'
import { Aleo } from 'next/font/google'
import Provider from '../context'
import Wrapper from '@/components/layout/Wrapper'
import isServer from 'utils/isServer'
import './globals.css'

const aleo = Aleo({
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Explore Engaging Blog Posts on Technology, Lifestyle, Travel, and Health | NexusNarrative',
  description: 'Explore engaging blog posts on technology, lifestyle, travel, and health. Stay informed and inspired with NexusNarrative.',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  console.log(`RootLayout: i was render on the ${isServer() ? "server" : "client"}`)

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
