import { useContext } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { FiCheck } from "react-icons/fi";
import { VotingContext } from "../context/VotingContext";
import  VotingPersons  from '../assets/Persons.png';

const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Welcome = () => {

    const { connectWallet, currentAccount, userEmail } = useContext(VotingContext);

    return (
        <div className="w-full flex justify-center items-center">
            <div className="w-full flex flex-1 md:flex-row flex-col items-start justify-between md:mt-9 md:p-20 py-12 px-4">
                <div className="w-full flex flex-1 flex-col justify-start items-start">
                    <div className="mb-4 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
                        Secure blockchain voting made simple
                    </div>
                    <h1 className="gradient-text text-3xl sm:text-5xl text-white py-4">
                        Next-Gen E-Voting: Secure <br /> Transparent and Trustworthy
                    </h1>
                    <p className="text-left my-5 text-white font-light md:w-9/12 w-11/12 text-base">
                        Vote with confidence—powered by blockchain technology for security and fairness. 🗳️
                    </p>

                    {!currentAccount && (
                        <button
                        type="button"
                        onClick={connectWallet}
                        className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
                        >
                        <AiFillPlayCircle className="text-white mr-2" />
                        <p className="text-white text-base font-semibold">
                            Connect Wallet
                        </p>
                        </button>
                    )}

                    {currentAccount && (
                        <h3 className="flex flex-row justify-center items-center my-5 rounded-full bg-emerald-500/15 px-4 py-3 text-emerald-200">
                            <FiCheck className="mr-2 text-2xl" />
                            <span className="text-base font-semibold">
                                Connected to Wallet
                            </span>
                        </h3>
                    )}

                    {userEmail && (
                        <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200">
                            Verified email: {userEmail}
                        </div>
                    )}

                    <div className="grid sm:grid-cols-3 grid-cols-2 md:w-3/5 w-full mt-5">
                        <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
                            Reliability
                        </div>
                        <div className={companyCommonStyles}>Security</div>
                        <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>
                            Transparent 
                        </div>
                        <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>
                            Decentralized 
                        </div>
                        <div className={companyCommonStyles}>Trustworthy</div>
                        <div className={`rounded-br-2xl ${companyCommonStyles}`}>
                            Immutable 
                        </div>
                    </div>
                </div>
                <div className="text-white">
                    <img src={VotingPersons} alt="VotingPersons" className="mt-16 mr-17" />
                </div>
            </div>
        </div>
    )
}

export default Welcome;