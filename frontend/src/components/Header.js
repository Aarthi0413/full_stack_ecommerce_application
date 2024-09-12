import React, { useContext, useState } from "react";
import axios from "axios";
import { GrSearch } from "react-icons/gr";
import { FaCircleUser } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import Context from "../context";

const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation()
  const [search, setSearch] = useState(searchInput?.search?.split("=")[1])
  console.log("search input",searchInput?.search.split("=")[1]);

  //console.log("user header", user);
  const userId = user?.data?._id;
  //console.log("User ID:", userId);

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/logout`, {
        withCredentials: true,
      });
      dispatch(setUserDetails(null));
      toast.success("Logout Successfully");
      navigate('/')
    } catch (error) {
      toast.error("Failed to Logout");
    }
  };

  //console.log("header add to cart count", context);

  const handleSearch = (e) =>{
    const {value} = e.target
    setSearch(value)
    if(value){
      navigate(`/search?q=${value}`)
    }else{
      navigate('/search')
    }
  }

  return (
    <header className="h-16 shadow-md bg-white font-serif fixed w-full z-40">
      <div className="h-full container mx-auto flex items-center justify-between px-5">
        <div className="">
          <Link to={"/"}>
            <h1 className="text-purple-800 font-serif font-bold shop-name">UPTREND</h1>
          </Link>
        </div>

        <div className="hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2">
          <input
            type="text"
            placeholder="search product here..."
            className="w-full outline-none p-2 bg-transparent"
            onChange={handleSearch} value={search}
          />
          <div className="text-lg min-w-[50px] h-10 bg-purple-600 flex items-center justify-center rounded-r-full text-white">
            <GrSearch />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative flex justify-center">
            {user?.data?._id && (
              <div
                className="text-3xl cursor-pointer flex justify-center"
                onClick={() => setMenuDisplay((prev) => !prev)}
              >
                <FaCircleUser />
              </div>
            )}

            {menuDisplay && (
              <div className="absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg  rounded">
                <nav>
                  {user?.data?.role === ROLE.ADMIN && (
                    <Link
                      to={"/admin-panel/all-products"}
                      className="whitespace-nowrap hidden md:block hover:bg-purple-100 p-2"
                      onClick={() => setMenuDisplay((prev) => !prev)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link to={'/order'} className="whitespace-nowrap hidden md:block hover:bg-purple-100 p-2"
                  onClick={() => setMenuDisplay((prev) => !prev)}>Order</Link>
                </nav>
              </div>
            )}
          </div>
          {user?.data?._id && (
            <Link to={"/cart"} className="text-3xl relative">
              <span>
                <FaCartShopping />
              </span>
              <div className="bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center p-1 absolute -top-2 -right-3">
                <p className="text-sm">{context?.cartProductCount}</p>
              </div>
            </Link>
          )}

          <div>
            {userId ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-purple-600 rounded-full text-white"
              >
                Logout
              </button>
            ) : (
              <Link
                to={"/login"}
                className="px-4 py-2 bg-purple-600 rounded-full text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
