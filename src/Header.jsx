import { FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  
  return (
    <div>
      <header className='bg-slate-200'>
        <div className='flex justify-between mx-auto max-w-7xl p-4 items-center'>
          <Link to='/'>
            <h1 className='font-bold text-lg sm:text-xl flex flex-wrap'> 
              <span className='text-slate-500'>Real</span>
              <span className='text-slate-800'>Estate</span>
            </h1>
          </Link>
          
          <form className='bg-slate-100 flex items-center p-3 rounded-lg'>
            <input type='text' placeholder='Search...' className='bg-transparent outline-none w-24 sm:w-64' aria-label='Search'/>
            <FaSearch className='text-slate-500' aria-hidden='true'/>
          </form>

          <ul className='flex gap-5 font-semibold'>
            <Link to='/'>
              <li className='hidden sm:inline text-slate-600 hover:underline'>Home</li>
            </Link>
            <Link to='/about'>
              <li className='hidden sm:inline text-slate-600 hover:underline'>About</li>
            </Link>
            
            <Link to='/profile'> 
              {currentUser ? (
                <img className='rounded-full h-7 w-7' src={currentUser.avatar || '/default-avatar.png'} alt={currentUser.name || 'profile'} />
              ) : (
                <li className='hidden sm:inline text-slate-600 hover:underline'>Sign in</li>
              )}
            </Link>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default Header;
