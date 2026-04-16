
import { Link } from "react-router-dom";

const Header = () => {


  return (
    <header className="bg-gradient-to-br from-orange-500 via-red-500 to-red-600 z-50  drop-shadow-sm py-3 px-4 flex flex-wrap md:flex-nowrap justify-between items-center gap-2">
      <div className="flex justify-center items-center md:w-20 md:h-20 sm:w-12 sm:h-12 border-2 border-red-400 rounded-full bg-gray-100 cursor-pointer">
        <Link className="" to="/settings/profilepage"  >
          <img
            src="/LOGOIMAGE.png"
            alt="Logo"
            className="h-20 w-20 object-contain"
          />
        </Link>
      </div>
      <div className="ml-45 flex-1 text-center md:text-left min-w-[200px]">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white uppercase">
          MAA ANUSAYA URBAN
        </h1>
        <p className="text-xs sm:text-sm text-white-mt-1">
          Credit Co-operative Society Ltd. Gondiya
        </p>
      </div>
      <div className="flex justify-center items-center w-10 h-10 sm:w-12 sm:h-12 border-2 border-red-400 rounded-full bg-gray-100 cursor-pointer">
        <Link className="" to="/profile"  >
          <img src="/ProfileImage.png" alt="profile image" />
        </Link>
      </div>
      {/* <div
        onClick={() => setOpen(true)}
        className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-red-400 rounded-full bg-gray-100 cursor-pointer"
      />

      <UpdateProfileModal isOpen={isModalOpen} onClose={() => setOpen(false)} /> */}
    </header>
  );
};

export default Header;
