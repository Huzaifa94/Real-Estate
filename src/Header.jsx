import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?/${searchQuery}`)
  };
useEffect(()=>{

  const urlParams = new URLSearchParams(window.location.search);
  const searchTermFromUrl = urlParams.get("searchTerm");
  if(searchTermFromUrl){
    setSearchTerm(searchTermFromUrl);
  }
 },[location.search]);

  return (
    <div>
      <header className="bg-slate-200">
        <div className="flex justify-between mx-auto max-w-7xl p-4 items-center">
          <Link to="/">
            <h1 className="font-bold text-lg sm:text-xl flex flex-wrap">
              <span className="text-slate-500">Real</span>
              <span className="text-slate-800">Estate</span>
            </h1>
          </Link>

          <form onSubmit={handleSubmit} className="bg-slate-100 flex items-center p-3 rounded-lg">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none w-24 sm:w-64"
              aria-label="Search"
              value={searchTerm}
              onChange={(e)=>setSearchTerm(e.target.value)}
            />
            <button>
            <FaSearch className="text-slate-500" aria-hidden="true" />
            </button>
          
          </form>

          <ul className="flex gap-5 font-semibold">
            <Link to="/">
              <li className="hidden sm:inline text-slate-600 hover:underline">
                Home
              </li>
            </Link>
            <Link to="/about">
              <li className="hidden sm:inline text-slate-600 hover:underline">
                About
              </li>
            </Link>

            <Link to="/profile">
              {currentUser ? (
                <img
                  className="rounded-full h-7 w-7"
                  src={currentUser.avatar || "/default-avatar.png"}
                  alt={currentUser.name || "profile"}
                />
              ) : (
                <li className="hidden sm:inline text-slate-600 hover:underline">
                  Sign in
                </li>
              )}
            </Link>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
