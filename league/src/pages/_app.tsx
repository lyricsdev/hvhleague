import SocketProvider from '@/components/socketProvider'
import { AuthProvider } from './AuthContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { NextUIProvider } from '@nextui-org/react'

export default function App({ Component, pageProps }: AppProps) {
  return     <NextUIProvider>  <AuthProvider>
        <SocketProvider><Component {...pageProps} /></SocketProvider>
    </AuthProvider></NextUIProvider>
}
