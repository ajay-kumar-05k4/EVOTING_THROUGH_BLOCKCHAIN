import { useState, useContext } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Checkbox } from './ui/Checkbox';
import { Dialog, DialogContent, DialogFooter } from './ui/Dialog';
import { VotingContext } from '../context/VotingContext';
import Navbar from './Navbar';

const VotingForm = () => {
  const { castVote, voterStatus, userEmail, currentAccount, voterRegistered, registerVoter } = useContext(VotingContext);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const candidates = [
    { id: 1, name: 'Candidate A' },
    { id: 2, name: 'Candidate B' },
    { id: 3, name: 'Candidate C' }
  ];

  const handleVote = () => {
    if (voterStatus) {
        setErrorMessage("You have already voted.");
        return;
    }
    if (!window.ethereum) {
        setErrorMessage("MetaMask is not installed. Please install it and refresh the page.");
        return;
    }
    if (!userEmail) {
        setErrorMessage("Please verify your email before voting.");
        return;
    }
    if (!currentAccount) {
        setErrorMessage("You should connect to the wallet first");
        return;
    }
    if (!selectedCandidate) {
        setErrorMessage("You should select a candidate first");
        return;
    }
    if (!voterRegistered) {
        setErrorMessage("Please register as a voter before submitting your vote.");
        return;
    }
    setConfirmationOpen(true);
  };
  
  const confirmVote = async () => {
    if (!selectedCandidate) {
        setErrorMessage("You should select a candidate first");
        return;
    }

    console.log("Submitting Vote:", { currentAccount, selectedCandidate });

    setConfirmationOpen(false);

    await castVote(selectedCandidate);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen gradient-bg-services">
        <Navbar />
          <div className="flex flex-1 flex-col items-center justify-center mb-14">
            <Card className="w-full flex justify-center items-center max-w-md p-6 bg-[#0f0e13] border border-gray-700 border-solid rounded-lg shadow-lg mb-4">
              <CardContent>
                <h2 className="text-2xl text-white font-bold mb-4 text-center">E-Voting Form</h2>
                <div className="mb-4">
                  <h3 className="text-lg text-white font-semibold mb-2">Verified Email:</h3>
                  {userEmail ? (
                    <p className="text-gray-300">{userEmail}</p>
                  ) : (
                    <p className="text-gray-500">Please verify your email to continue</p>
                  )}
                </div>
                <div className="mb-4">
                  <h3 className="text-lg text-white font-semibold mb-2">Voter Registration:</h3>
                  {voterRegistered ? (
                    <p className="text-green-400">Eligible voter registered successfully</p>
                  ) : (
                    <p className="text-yellow-400">Not registered yet</p>
                  )}
                </div>
                <div className="mb-4">
                  <h3 className="text-lg text-white font-semibold mb-2">Voter ID:</h3>
                  {currentAccount ? (
                    <p className="text-gray-300">{currentAccount}</p>
                  ) : (
                    <p className="text-gray-500">Please connect your wallet to see Voter ID</p>
                  )}
                </div>
                <div className="mb-4">
                  <h3 className="text-lg text-white font-semibold mb-2">Select a Candidate:</h3>
                  {candidates.map(candidate => (
                    <div key={candidate.id} className="flex items-center mb-2">
                      <Checkbox
                        checked={selectedCandidate === candidate.id}
                        onCheckedChange={() => setSelectedCandidate(candidate.id)}
                        className="mr-2 cursor-pointer"
                      />
                      <span className="text-gray-300">{candidate.name}</span>
                    </div>
                  ))}
                </div>
                {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
                {!voterRegistered && userEmail && currentAccount && (
                  <Button
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-80 cursor-pointer mb-3"
                    onClick={registerVoter}
                  >
                    Register as Voter
                  </Button>
                )}

                <Button
                  className="w-full bg-gradient-to-r from-[#1c2541] to-[#0b132b] text-white px-4 py-2 rounded-lg shadow-md hover:opacity-80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleVote}
                  disabled={!userEmail || !currentAccount || !voterRegistered || voterStatus}
                >
                  {voterStatus ? "Already Voted" : "Submit Vote"}
                </Button>
              </CardContent>
            </Card>

            {voterStatus && (
              <p className="text-red-500 font-semibold mt-2">⚠️ You have already voted!</p>
            )}

            <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
              <DialogContent>
                <h3 className="text-2xl font-bold mb-4 text-gray-300">Confirm Your Vote</h3>
                <p className="text-gray-400">
                  Voter ID: {currentAccount || "Not Connected"}
                </p>
                <p className="text-gray-400">
                  Selected Candidate: {candidates.find((c) => c.id === selectedCandidate)?.name}
                </p>
                <DialogFooter className="flex justify-end space-x-4 mt-4">
                  <Button
                    variant="ghost"
                    className="text-white bg-transparent border border-gray-700 border-solid px-4 py-2 rounded-lg cursor-pointer"
                    onClick={() => setConfirmationOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='confirm'
                    className="bg-gradient-to-r from-[#1c2541] to-[#0b132b] text-white px-4 py-2 rounded-lg shadow-md hover:opacity-80 cursor-pointer"
                    onClick={confirmVote}
                  >
                    Confirm Vote
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </div>
      </div>
    </>
  );
};

export default VotingForm;