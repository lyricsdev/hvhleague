import Image from 'next/image'
import { useAuth } from './AuthContext';


export default function Home() {
  const { token } = useAuth();

  return (
   <main>{token}</main>
  )
}
