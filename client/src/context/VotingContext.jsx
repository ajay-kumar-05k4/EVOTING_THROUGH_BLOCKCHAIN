import React, { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { contractABI, contractAddress } from "../utils/constants";
import { checkEmailExistsInDB, checkVoterExistsInDB, saveVoterRecordToDB } from "../firebase.config";

// eslint-disable-next-line react-refresh/only-export-components
export const VotingContext = React.createContext();

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const getEthereumContract = async () => {
    // Read window.ethereum fresh on every call instead of caching it once at
    // module load time. MetaMask often injects window.ethereum a moment
    // after the page's own scripts start running, so a cached reference can
    // stay stuck at `undefined` forever even after MetaMask finishes loading.
    const ethereum = window.ethereum;

    if (!ethereum) {
        console.error("No Ethereum object found. Please install MetaMask.");
        return null;
    }

    try {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const votingContract = new ethers.Contract(contractAddress, contractABI, signer);
        return votingContract;
    } catch (error) {
        console.error("Error initializing contract:", error);
        return null;
    }
};

export const VotingProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [candidateVotes, setCandidateVotes] = useState({});
    const [candidatesCount, setCandidatesCount] = useState(0);
    const [voterStatus, setVoterStatus] = useState(false);
    const [voterRegistered, setVoterRegistered] = useState(false);
    const [userEmail, setUserEmailState] = useState(() => {
        const storedEmail = localStorage.getItem("userEmail");
        return storedEmail ? normalizeEmail(storedEmail) : "";
    });

    const setUserEmail = (email) => {
        const normalizedEmail = normalizeEmail(email);
        setUserEmailState(normalizedEmail);
        localStorage.setItem("userEmail", normalizedEmail);
    };

    const unsetUserEmail = () => {
        setUserEmailState("");
        setVoterRegistered(false);
        setVoterStatus(false);
        localStorage.removeItem("userEmail");
        localStorage.removeItem("emailForSignIn");
    };

    const refreshVoteStatus = useCallback(async () => {
        if (!currentAccount || !userEmail) {
            setVoterStatus(false);
            return false;
        }

        try {
            const votingContract = await getEthereumContract();
            if (!votingContract) {
                setVoterStatus(false);
                return false;
            }

            const hasVoted = await votingContract.hasvoted(currentAccount, userEmail);
            setVoterStatus(Boolean(hasVoted));
            return Boolean(hasVoted);
        } catch (error) {
            console.error("Error checking vote status:", error);
            setVoterStatus(false);
            return false;
        }
    }, [currentAccount, userEmail]);

    const checkVoterEligibility = useCallback(async () => {
        if (!currentAccount || !userEmail) {
            setVoterRegistered(false);
            setVoterStatus(false);
            return false;
        }

        const emailExists = await checkEmailExistsInDB(userEmail);
        if (!emailExists) {
            setVoterRegistered(false);
            setVoterStatus(false);
            return false;
        }

        const voterExists = await checkVoterExistsInDB(currentAccount, userEmail);
        setVoterRegistered(voterExists);

        if (!voterExists) {
            setVoterStatus(false);
            return false;
        }

        await refreshVoteStatus();
        return voterExists;
    }, [currentAccount, refreshVoteStatus, userEmail]);

    const registerVoter = useCallback(async () => {
        if (!currentAccount || !userEmail) {
            toast.error("Please verify your email and connect your wallet before registering.");
            return false;
        }

        const emailExists = await checkEmailExistsInDB(userEmail);
        if (!emailExists) {
            toast.error("Your email is not verified yet.");
            return false;
        }

        const saved = await saveVoterRecordToDB(currentAccount, userEmail);
        if (!saved) {
            toast.error("Unable to register voter. Please try again.");
            return false;
        }

        setVoterRegistered(true);
        toast.success("Voter registration successful.");
        return true;
    }, [currentAccount, userEmail]);

    const fetchVotes = useCallback(async () => {
        try {
            const votingContract = await getEthereumContract();
            if (!votingContract) return;

            // Convert BigInt results from the contract to plain Numbers right
            // away. Leaving them as BigInt causes a runtime TypeError later
            // wherever they're mixed with ordinary numbers (e.g. computing
            // vote percentages on the Result page).
            const count = Number(await votingContract.candidatesCount());
            setCandidatesCount(count);

            let votesData = {};
            for (let i = 1; i <= count; i++) {
                const votes = await votingContract.getVotes(i);
                votesData[i] = Number(votes);
            }

            setCandidateVotes(votesData);
            console.log("Updated candidate votes:", votesData);
        } catch (error) {
            console.error("Error fetching votes:", error);
        }
    }, []);

    const castVote = async (candidateId) => {
        try {
            const ethereum = window.ethereum;

            if (!ethereum) {
                console.error("No Ethereum object found. Please install MetaMask.");
                toast.error("MetaMask is not installed.");
                return;
            }

            if (!currentAccount) {
                toast.error("Please connect your wallet first.");
                return;
            }

            if (!userEmail) {
                toast.error("Please verify your email before voting.");
                return;
            }

            const emailExists = await checkEmailExistsInDB(userEmail);
            if (!emailExists) {
                toast.error("Your email is not verified. Please complete email verification first.");
                return;
            }

            const voterExists = await checkVoterExistsInDB(currentAccount, userEmail);
            if (!voterExists) {
                toast.error("Please register as a voter before voting.");
                return;
            }

            const votingContract = await getEthereumContract();
            if (!votingContract) {
                console.error("Voting contract not found.");
                toast.error("Voting contract is not available right now.");
                return;
            }

            const hasVoted = await votingContract.hasvoted(currentAccount, userEmail);
            if (hasVoted) {
                setVoterStatus(true);
                toast.error("You have already voted.");
                console.log("You have already voted my friend!");
                return;
            }

            console.log("Voting for Candidate ID:", candidateId);

            const tx = await votingContract.vote(candidateId, userEmail);
            await tx.wait();

            setVoterStatus(true);
            console.log(`Vote casted for candidate ${candidateId}`);
            toast.success("Vote submitted successfully!");

            fetchVotes();
        } catch (error) {
            console.error("Error while casting vote:", error);
            toast.error(error?.reason || "Unable to cast vote. Please try again.");
        }
    };

    const checkIfWalletIsConnect = useCallback(async () => {
        try {
            const ethereum = window.ethereum;

            if (!ethereum) {
                console.log("No ethereum object found. Please install MetaMask.");
                return;
            }

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
                console.log("Wallet is connected:", accounts[0]);
                await checkVoterEligibility();
                await refreshVoteStatus();
                fetchVotes();
            } else {
                setCurrentAccount(null);
                setVoterRegistered(false);
                setVoterStatus(false);
                console.log("No authorized account found.");
            }
        } catch (error) {
            console.log("Error checking wallet connection:", error);
        }
    }, [checkVoterEligibility, fetchVotes, refreshVoteStatus]);

    const connectWallet = useCallback(async () => {
        try {
            const ethereum = window.ethereum;
            if (!ethereum) {
                toast.error("MetaMask is not installed. Please install it to continue.");
                return;
            }

            const accounts = await ethereum.request({ method: "eth_requestAccounts" });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
                console.log("Wallet connected:", accounts[0]);
                await checkVoterEligibility();
                await refreshVoteStatus();
                fetchVotes();
            }
        } catch (error) {
            console.log("Error connecting wallet:", error);
            toast.error("Unable to connect wallet. Please try again.");
        }
    }, [checkVoterEligibility, fetchVotes, refreshVoteStatus]);

    useEffect(() => {
        checkIfWalletIsConnect();

        const ethereum = window.ethereum;

        const handleAccountsChanged = async (accounts) => {
            if (!accounts.length) {
                window.location.reload();
            } else if (accounts[0] !== currentAccount) {
                setCurrentAccount(accounts[0]);
                await checkVoterEligibility();
                fetchVotes();
            }
        };

        if (ethereum) {
            ethereum.on("accountsChanged", handleAccountsChanged);
        }

        return () => {
            if (ethereum) {
                ethereum.removeListener("accountsChanged", handleAccountsChanged);
            }
        };
    }, [currentAccount, checkIfWalletIsConnect, checkVoterEligibility, fetchVotes]);

    useEffect(() => {
        if (currentAccount && userEmail) {
            checkVoterEligibility();
            refreshVoteStatus();
        } else {
            setVoterStatus(false);
            setVoterRegistered(false);
        }
    }, [currentAccount, userEmail, checkVoterEligibility, refreshVoteStatus]);

    const contextValue = useMemo(() => ({
        connectWallet,
        currentAccount,
        castVote,
        candidateVotes,
        candidatesCount,
        voterStatus,
        voterRegistered,
        userEmail,
        setUserEmail,
        unsetUserEmail,
        registerVoter,
        checkVoterEligibility,
    }), [
        connectWallet,
        currentAccount,
        candidateVotes,
        candidatesCount,
        voterStatus,
        voterRegistered,
        userEmail,
        registerVoter,
        checkVoterEligibility,
    ]);

    return (
        <VotingContext.Provider value={contextValue}>
            {children}
        </VotingContext.Provider>
    );
};

VotingProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
