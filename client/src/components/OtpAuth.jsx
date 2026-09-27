import { useState, useContext, useEffect, useRef } from "react";
import { BsFillShieldLockFill, BsEnvelopeFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import { auth, saveVerifiedEmailToDB } from "../firebase.config";
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { VotingContext } from "../context/VotingContext";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const OtpAuth = () => {
    const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    // Separate from `loading` (which is only for the "send link" button) so
    // clicking the email link shows its own screen instead of silently
    // reusing the plain login form — that reuse is what made it look like
    // the app was "looping" back to sign-in.
    const [verifying, setVerifying] = useState(false);
    const [verifyError, setVerifyError] = useState("");
    const { setUserEmail, userEmail } = useContext(VotingContext);
    const navigate = useNavigate();
    // Guards against the link being processed twice — once from React 18
    // StrictMode's intentional double-effect in dev, and again on any
    // re-render/refresh while the sign-in query params are still in the URL.
    const hasProcessedLink = useRef(false);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const sendOtpToEmail = async () => {
        if (!isEmailValid) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        const actionCodeSettings = {
            // Use the current origin instead of a hardcoded localhost URL so
            // this keeps working once the app is deployed anywhere else.
            url: window.location.origin,
            handleCodeInApp: true,
        };

        setVerifyError("");

        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            toast.success("Verification link sent! Check your inbox.");
            localStorage.setItem("emailForSignIn", email);
            setOtpSent(true);
        } catch (error) {
            console.error("Error sending OTP email:", error);
            toast.error("Failed to send verification link. Try again.");
            setVerifyError(`${error?.code || "Error"}: ${error?.message || "Failed to send verification link."}`);
        }

        setLoading(false);
    };

    useEffect(() => {
        const verifyOtpFromEmail = async () => {
            const signInUrl = window.location.href;

            if (!isSignInWithEmailLink(auth, signInUrl)) return;
            if (hasProcessedLink.current) return;
            hasProcessedLink.current = true;

            // Strip the oobCode/mode query params from the address bar right
            // away. Firebase sign-in links are single-use: if we leave them
            // in the URL, a refresh or a remount would try to sign in again
            // with an already-consumed link, fail, and leave the user stuck
            // looking like the app is "looping" back to the login screen.
            window.history.replaceState({}, document.title, window.location.pathname);

            setVerifying(true);
            setVerifyError("");

            let storedEmail = localStorage.getItem("emailForSignIn");
            if (!storedEmail) {
                storedEmail = prompt("Enter your email to confirm OTP:");
            }

            if (!storedEmail) {
                setVerifying(false);
                setVerifyError("We couldn't find the email this link was sent to. Please request a new link.");
                return;
            }

            try {
                const result = await signInWithEmailLink(auth, storedEmail, signInUrl);
                console.log("✅ Email OTP Verified!", result);

                const saved = await saveVerifiedEmailToDB(storedEmail);
                if (!saved) {
                    setVerifying(false);
                    setVerifyError("Your email was verified, but we couldn't save it to the database. Check your Firestore connection/rules and try again.");
                    return;
                }

                setUserEmail(storedEmail);
                localStorage.removeItem("emailForSignIn");

                toast.success("Verification successful!");
                navigate("/Home", { replace: true });
            } catch (error) {
                console.error("❌ Error verifying OTP:", error);
                setVerifying(false);
                setVerifyError(
                    `${error?.code || "Error"}: ${error?.message || "Invalid or expired link. Please request a new one."}`
                );
            }
        };

        verifyOtpFromEmail();
    }, [navigate, setUserEmail]);


    if (verifying) {
        return (
            <div className="gradient-bg-transactions flex items-center justify-center min-h-screen px-4 py-8">
                <Toaster />
                <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-blue-900/20 backdrop-blur-sm text-center space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-blue-300">
                        <CgSpinner size={30} className="animate-spin" />
                    </div>
                    <p className="text-xl font-semibold text-white">Verifying your sign-in link…</p>
                    <p className="text-sm text-gray-300">Please wait, this only takes a moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="gradient-bg-transactions flex items-center justify-center min-h-screen px-4 py-8">
            <Toaster />
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-blue-900/20 backdrop-blur-sm">
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-900/30">
                        <BsEnvelopeFill size={28} />
                    </div>
                    <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Secure Access</p>
                    <h1 className="mt-3 text-3xl font-bold text-white">
                        E-Voting Portal
                    </h1>
                </div>

                {verifyError && (
                    <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                        {verifyError}
                    </div>
                )}

                {otpSent ? (
                    <div className="space-y-4 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-blue-300">
                            <BsFillShieldLockFill size={30} />
                        </div>
                        <div>
                            <p className="text-xl font-semibold text-white">Verification link sent</p>
                            <p className="mt-2 text-sm text-gray-300">
                                Click the secure link in your email to continue to the voting dashboard.
                            </p>
                        </div>
                        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-100">
                            {email || userEmail || "your email"}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-200">Email address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 focus:border-blue-400 focus:outline-none"
                            />
                        </div>

                        <button
                            onClick={sendOtpToEmail}
                            disabled={loading || !isEmailValid}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading && <CgSpinner size={18} className="animate-spin" />}
                            <span>{loading ? "Sending..." : "Send verification link"}</span>
                        </button>

                        <div className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-xs text-gray-300">
                            Secure email authentication helps prevent duplicate voting and protects voter identity.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OtpAuth
