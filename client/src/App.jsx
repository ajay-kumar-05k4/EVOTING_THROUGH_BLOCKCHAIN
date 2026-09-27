import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import OtpAuth from './components/OtpAuth';
import { VotingContext } from './context/VotingContext';

function App() {
    const { userEmail } = useContext(VotingContext);

    // If we already have a verified email (from a previous session, stored
    // in localStorage), skip the login screen entirely and go to /Home
    // instead of forcing the user back through OtpAuth.
    if (userEmail) {
        return <Navigate to="/Home" replace />;
    }

    return (
        <div className='min-h-screen'>
            <div className='min-h-[100vh]'>
                <OtpAuth />
            </div>
        </div>
    );
}

export default App;
