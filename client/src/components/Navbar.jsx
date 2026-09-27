import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import { VotingContext } from "../context/VotingContext";

const Navbar = () => {
    const navigate = useNavigate();
    const { unsetUserEmail, userEmail, currentAccount } = useContext(VotingContext);

    const handleLogout = () => {
        unsetUserEmail();
        navigate("/", { replace: true });
    };

    return (
        <nav className="w-full flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:px-10">
            <div className="flex items-center justify-between md:justify-start gap-4">
                <Link to="/Home">
                    <img src={logo} alt="logo" className="w-28 cursor-pointer md:w-32" />
                </Link>
                {currentAccount && (
                    <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                        Wallet connected
                    </div>
                )}
            </div>

            <ul className="text-white flex flex-wrap list-none items-center justify-center gap-3 md:gap-4">
                <Link to="/Home">
                    <li className="rounded-full px-3 py-2 text-sm transition hover:bg-white/5">Home</li>
                </Link>
                <Link to="/Vote">
                    <li className="rounded-full px-3 py-2 text-sm transition hover:bg-white/5">Vote</li>
                </Link>
                <Link to="/Result">
                    <li className="rounded-full px-3 py-2 text-sm transition hover:bg-white/5">Result</li>
                </Link>
                {userEmail && (
                    <li className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-200 md:block">
                        {userEmail}
                    </li>
                )}
                <li
                    className="cursor-pointer rounded-full bg-[#2952e3] px-5 py-2 text-sm font-medium transition hover:bg-[#2546bd]"
                    onClick={handleLogout}
                >
                    Log out
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;