import { MdMyLocation, MdOutlineLocationOn, MdWbSunny } from 'react-icons/md'
import Searchbox from './Searchbox'

interface Props {}

export default function Navbar ({}: Props) {
  return (
    <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
      <div className="h-[80px] w-full flex justify-between items-center px-3 max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-gray-500 text-3xl">Clima</h2>
          <MdWbSunny className='text-3xl mt-1 text-yellow-300' />
        </div>
        <section className='flex gap-2 items-center'>
          <MdMyLocation className='text-2xl text-gray-400 hover:opacity-80 cursor-pointer' />
          <MdOutlineLocationOn className='text-3xl cursor-pointer' />
          <p className='text-slate-900/80 text-sm'>Córdoba</p>
        <div>
          {/* Search Box */}
          <Searchbox />
        </div>
        </section>
      </div>
    </nav>
  )
}
