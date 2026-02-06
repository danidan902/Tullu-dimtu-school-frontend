// PhoneVerification.jsx
import { useState } from "react";
import axios from "axios";
import { CheckCircle, Phone, Key, Loader2 } from "lucide-react";

const PhoneVerification = () => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Send code to Twilio
  const sendCode = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post("https://tullu-dimtu-school-backend-1.onrender.com/api/send-verification", {
        phone: "+251" + phone, // Send full E.164 format
      });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  // Verify code with Twilio
  const verifyCode = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("https://tullu-dimtu-school-backend-1.onrender.com/api/check-verification", {
        phone: "+251" + phone,
        code,
      });
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setCode("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Phone Verification</h1>
          <p className="text-gray-500">
            {step === 1
              ? "Enter your phone number to receive a code"
              : "Enter the verification code sent to your phone"}
          </p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verified!</h2>
            <p className="text-gray-600">Your phone number has been successfully verified.</p>
          </div>
        ) : (
          <>
            {step === 1 ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">+251</span>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
                      className="w-full pl-16 py-3.5 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="9XXXXXXXX"
                      disabled={loading}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Enter your 9-digit Ethiopian mobile number
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full pl-12 py-3.5 border border-gray-300 rounded-xl text-lg tracking-widest text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="000000"
                      maxLength={6}
                      disabled={loading}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Enter the 6-digit code sent to {phone}</p>
                </div>
                <button
                  onClick={resetFlow}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  ← Change phone number
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="mt-8">
              {step === 1 ? (
                <button
                  onClick={sendCode}
                  disabled={!phone || phone.length !== 9 || loading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              ) : (
                <button
                  onClick={verifyCode}
                  disabled={code.length !== 6 || loading}
                  className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </button>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {step === 1 ? (
                  "By continuing, you agree to receive an SMS for verification."
                ) : (
                  "Didn't receive the code? "
                )}
                {step === 2 && (
                  <button onClick={sendCode} className="text-blue-600 hover:text-blue-800 font-medium">
                    Resend code
                  </button>
                )}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PhoneVerification;








