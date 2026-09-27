import { useContext, useEffect, useMemo, useState } from 'react';

import { VotingContext } from '../context/VotingContext';
import Navbar from './Navbar';

const Result = () => {
  const { candidateVotes } = useContext(VotingContext);

  const [candidates, setCandidates] = useState([
    { id: 1, name: "Candidate A", votes: 0 },
    { id: 2, name: "Candidate B", votes: 0 },
    { id: 3, name: "Candidate C", votes: 0 },
  ]);

  useEffect(() => {
    setCandidates((prevCandidates) =>
      prevCandidates.map((candidate) => ({
        ...candidate,
        votes: candidateVotes?.[candidate.id] || 0,
      }))
    );
  }, [candidateVotes]);

  const totalVotes = useMemo(
    () => candidates.reduce((sum, candidate) => sum + Number(candidate.votes || 0), 0),
    [candidates]
  );

  const winner = useMemo(() => {
    return [...candidates].sort((a, b) => b.votes - a.votes)[0];
  }, [candidates]);

  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-gray-100 gradient-bg-footer">
      <Navbar />
      <div className="bg-[#0f0e13] rounded-lg shadow-lg p-6 border border-gray-700 border-solid w-full max-w-lg mb-12">
        <h2 className="text-2xl font-bold mb-4 text-white text-center">
          Voting Results
        </h2>

        <div className="mb-6 rounded-lg border border-green-500 bg-green-500/10 p-4 text-center">
          <p className="text-sm uppercase tracking-wide text-green-300">Current Leader</p>
          <h3 className="text-2xl font-bold text-white mt-2">{winner?.name || 'No winner yet'}</h3>
          <p className="text-gray-300 mt-1">{winner?.votes || 0} votes</p>
        </div>

        <div className="mb-6 text-gray-300 text-sm">
          Total votes cast: <span className="font-semibold text-white">{totalVotes}</span>
        </div>

        <ul className="space-y-4">
          {candidates.map((candidate) => {
            const votePercent = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;

            return (
              <li key={candidate.id} className="text-white">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">{candidate.name}</span>
                  <span className="text-gray-300">{candidate.votes} votes</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    style={{ width: `${votePercent}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs text-gray-400 mt-1">{votePercent.toFixed(1)}%</div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Result;
