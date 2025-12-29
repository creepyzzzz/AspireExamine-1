import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/lib/supabaseClient';
import Button from '@/components/landing/Button';

const AspireExamineLogo = () => (
  <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl border-2 border-pastel-dark shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] bg-pastel-lilac text-pastel-dark">
    <span className="font-bold text-base md:text-lg">A</span>
  </div>
);

export const LoginPage = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isLogin, setIsLogin] = useState(true);
  const [signupStage, setSignupStage] = useState('enterDetails'); // 'enterDetails' | 'enterOtp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('email');
  const [otpExpiresAt, setOtpExpiresAt] = useState<number | null>(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpExpiresAt) {
      timer = setInterval(() => {
        if (otpExpiresAt < Date.now()) {
          setOtpExpiresAt(null);
        }
        // Force re-render to update countdown
        setOtpExpiresAt(otpExpiresAt => otpExpiresAt ? otpExpiresAt - 1000 : null);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpExpiresAt]);

  const handleEmailSignUp = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setEmailConfirmationSent(true);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      // The onAuthStateChange listener in App.tsx will handle the login
    }
    setLoading(false);
  };

  const handlePhoneSignIn = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ phone: `+91${phone}` });
    if (error) {
      setError(error.message);
    } else {
      setSignupStage('enterOtp');
      setOtpExpiresAt(Date.now() + 600000); // 10 minutes
      setResendDisabled(true);
      setTimeout(() => setResendDisabled(false), 600000);
    }
    setLoading(false);
  };

  const handleOtpVerify = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.verifyOtp({ phone: `+91${phone}`, token: otp, type: 'sms' });

    if (error) {
      setError(error.message);
    } else {
      // The onAuthStateChange listener in App.tsx will handle the login
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setError(null);
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) {
      setError(error.message);
    } else {
      alert("Password reset link has been sent to your email.");
    }
    setLoading(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (activeTab === 'email') {
      if (isLogin) {
        handleEmailLogin();
      } else {
        handleEmailSignUp();
      }
    } else {
      if (signupStage === 'enterDetails') {
        handlePhoneSignIn();
      } else {
        handleOtpVerify();
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setSignupStage('enterDetails');
    setError(null);
    setEmailConfirmationSent(false);
  };

  return (
    <div className="min-h-screen bg-cream font-sans antialiased text-slate-800">
      {/* Main Content - Split Screen */}
      <main className="flex min-h-screen">
        {/* Left Side - Character Image (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Background Gradient Shapes */}
          <div className="absolute inset-0 bg-gradient-to-br from-pastel-purple/20 via-pastel-lilac/30 to-pastel-pink/20 left-[-10%] w-[90%]" />
          
          {/* Decorative Background Blobs */}
          <motion.div
            animate={prefersReducedMotion ? {} : {
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 right-[10%] w-80 h-80 bg-gradient-to-b from-pastel-purple/20 to-pastel-pink/20 rounded-full blur-[80px] -z-10"
          />
          <motion.div
            animate={prefersReducedMotion ? {} : {
              y: [0, 20, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-t from-pastel-yellow/30 to-pastel-green/20 rounded-full blur-[60px] -z-10"
          />

          {/* Header - Overlay on left side */}
          <header className="absolute top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <a href="/" className="flex items-center gap-2 sm:gap-3">
                <AspireExamineLogo />
                <span className="font-heading font-bold tracking-tight text-pastel-dark text-lg sm:text-xl md:text-2xl">
                  AspireExamine
                </span>
              </a>
            </div>
          </header>

          {/* Character Image Container */}
          <div className="relative z-10 flex items-end justify-start w-full h-full p-12 pb-0 pl-16">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative w-full h-full max-w-4xl -mb-12"
            >
              <motion.img
                src="/images/splitloginimgage.png"
                alt="AspireExamine character"
                className="w-full h-full object-contain"
                animate={prefersReducedMotion ? {} : {
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))' }}
              />
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Header - On mobile/right side */}
          <header className="lg:hidden relative z-50 w-full px-4 sm:px-6 py-4">
            <div className="flex items-center">
              <a href="/" className="flex items-center gap-2 sm:gap-3">
                <AspireExamineLogo />
                <span className="font-heading font-bold tracking-tight text-pastel-dark text-lg sm:text-xl md:text-2xl">
                  AspireExamine
                </span>
              </a>
            </div>
          </header>
          
          <div className="flex items-center justify-center flex-1 p-4 sm:p-6 lg:p-12">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            {/* Title Section */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-pastel-dark mb-2 tracking-tight">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-sm sm:text-base text-gray-700">
                  {isLogin ? 'Login to access your dashboard' : 'Sign up to get started'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-50 border-2 border-red-200 text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Form Content */}
            <AnimatePresence mode="wait">
              {emailConfirmationSent ? (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center space-y-4 p-6 bg-white rounded-2xl border-2 border-pastel-dark shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]"
                >
                  <p className="text-gray-700">
                    A confirmation email has been sent to your email address. Please confirm it to complete account creation.
                  </p>
                  <Button onClick={() => setEmailConfirmationSent(false)} fullWidth>
                    Back to Login
                  </Button>
                </motion.div>
              ) : signupStage === 'enterOtp' && activeTab === 'phone' ? (
                <motion.form
                  key="otp"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={(e) => { e.preventDefault(); handleOtpVerify(); }}
                  className="space-y-6"
                >
                  <div className="space-y-4 text-center">
                    <Label htmlFor="otp" className="text-base font-semibold text-pastel-dark">Enter OTP</Label>
                    <p className="text-sm text-gray-600">An OTP has been sent to your phone.</p>
                    <div className="flex justify-center">
                      <InputOTP 
                        maxLength={6} 
                        id="otp" 
                        value={otp} 
                        onChange={setOtp}
                        containerClassName="gap-3"
                      >
                        <InputOTPGroup className="gap-3">
                          <InputOTPSlot 
                            index={0} 
                            className="!h-14 !w-14 !bg-white !border-2 !border-pastel-dark !rounded-xl !text-lg !font-bold !shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] !border-l-2 !border-r-2 !border-t-2 !border-b-2 data-[active]:!ring-2 data-[active]:!ring-pastel-purple data-[active]:!border-pastel-purple transition-all" 
                          />
                          <InputOTPSlot 
                            index={1} 
                            className="!h-14 !w-14 !bg-white !border-2 !border-pastel-dark !rounded-xl !text-lg !font-bold !shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] !border-l-2 !border-r-2 !border-t-2 !border-b-2 data-[active]:!ring-2 data-[active]:!ring-pastel-purple data-[active]:!border-pastel-purple transition-all" 
                          />
                          <InputOTPSlot 
                            index={2} 
                            className="!h-14 !w-14 !bg-white !border-2 !border-pastel-dark !rounded-xl !text-lg !font-bold !shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] !border-l-2 !border-r-2 !border-t-2 !border-b-2 data-[active]:!ring-2 data-[active]:!ring-pastel-purple data-[active]:!border-pastel-purple transition-all" 
                          />
                          <InputOTPSlot 
                            index={3} 
                            className="!h-14 !w-14 !bg-white !border-2 !border-pastel-dark !rounded-xl !text-lg !font-bold !shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] !border-l-2 !border-r-2 !border-t-2 !border-b-2 data-[active]:!ring-2 data-[active]:!ring-pastel-purple data-[active]:!border-pastel-purple transition-all" 
                          />
                          <InputOTPSlot 
                            index={4} 
                            className="!h-14 !w-14 !bg-white !border-2 !border-pastel-dark !rounded-xl !text-lg !font-bold !shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] !border-l-2 !border-r-2 !border-t-2 !border-b-2 data-[active]:!ring-2 data-[active]:!ring-pastel-purple data-[active]:!border-pastel-purple transition-all" 
                          />
                          <InputOTPSlot 
                            index={5} 
                            className="!h-14 !w-14 !bg-white !border-2 !border-pastel-dark !rounded-xl !text-lg !font-bold !shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] !border-l-2 !border-r-2 !border-t-2 !border-b-2 data-[active]:!ring-2 data-[active]:!ring-pastel-purple data-[active]:!border-pastel-purple transition-all" 
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {otpExpiresAt && (
                      <p className="text-xs text-gray-600">
                        OTP expires in {Math.max(0, Math.round((otpExpiresAt - Date.now()) / 1000))}s
                      </p>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    whileTap={{ scale: 0.96 }}
                    whileHover={{
                      y: -2,
                      x: -2,
                      boxShadow: "5px 5px 0px 0px rgba(17,17,17,1)",
                      transition: { type: "spring", stiffness: 400, damping: 15 }
                    }}
                    className="w-full px-6 py-3 rounded-full font-heading font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden select-none bg-[#DDFCE5] text-[#111111] border-2 border-[#111111] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10">
                      {loading ? 'Verifying...' : 'Verify & Create Account'}
                    </span>
                  </motion.button>
                  <button
                    type="button"
                    onClick={handlePhoneSignIn}
                    disabled={resendDisabled || loading}
                    className="w-full text-sm text-pastel-dark hover:text-pastel-purple font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend OTP
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="main-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Tabs defaultValue="email" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-pastel-gray rounded-xl p-1 border-2 border-pastel-dark h-12">
                      <TabsTrigger
                        value="email"
                        className="rounded-lg font-semibold transition-all h-full data-[state=active]:font-bold data-[state=active]:text-pastel-purple data-[state=inactive]:text-gray-700"
                      >
                        Email
                      </TabsTrigger>
                      <TabsTrigger
                        value="phone"
                        className="rounded-lg font-semibold transition-all h-full data-[state=active]:font-bold data-[state=active]:text-pastel-purple data-[state=inactive]:text-gray-700"
                      >
                        Phone
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email" className="mt-0">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                          {isLogin ? (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-pastel-dark">
                                  Email
                                </Label>
                                <Input
                                  id="email"
                                  name="email"
                                  placeholder="Enter your email"
                                  required
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="h-12 bg-white border-2 border-pastel-dark rounded-xl px-4 text-base focus-visible:ring-2 focus-visible:ring-pastel-purple focus-visible:border-pastel-purple shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all"
                                />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor="password" className="text-sm font-semibold text-pastel-dark">
                                    Password
                                  </Label>
                                  <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-xs text-pastel-purple hover:text-pastel-dark font-semibold transition-colors"
                                  >
                                    Forgot Password?
                                  </button>
                                </div>
                                <div className="relative">
                                  <Input
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 bg-white border-2 border-pastel-dark rounded-xl px-4 pr-12 text-base focus-visible:ring-2 focus-visible:ring-pastel-purple focus-visible:border-pastel-purple shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pastel-dark transition-colors"
                                  >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                  </button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-semibold text-pastel-dark">
                                  Username
                                </Label>
                                <Input
                                  id="username"
                                  name="username"
                                  placeholder="Enter your username"
                                  required
                                  type="text"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  className="h-12 bg-white border-2 border-pastel-dark rounded-xl px-4 text-base focus-visible:ring-2 focus-visible:ring-pastel-purple focus-visible:border-pastel-purple shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-pastel-dark">
                                  Email
                                </Label>
                                <Input
                                  id="email"
                                  name="email"
                                  placeholder="Enter your email"
                                  required
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="h-12 bg-white border-2 border-pastel-dark rounded-xl px-4 text-base focus-visible:ring-2 focus-visible:ring-pastel-purple focus-visible:border-pastel-purple shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-pastel-dark">
                                  Password
                                </Label>
                                <div className="relative">
                                  <Input
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 bg-white border-2 border-pastel-dark rounded-xl px-4 pr-12 text-base focus-visible:ring-2 focus-visible:ring-pastel-purple focus-visible:border-pastel-purple shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pastel-dark transition-colors"
                                  >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <motion.button
                          type="submit"
                          disabled={loading}
                          whileTap={{ scale: 0.96 }}
                          whileHover={{
                            y: -2,
                            x: -2,
                            boxShadow: "5px 5px 0px 0px rgba(17,17,17,1)",
                            transition: { type: "spring", stiffness: 400, damping: 15 }
                          }}
                          className="w-full px-6 py-3 rounded-full font-heading font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden select-none bg-[#DDFCE5] text-[#111111] border-2 border-[#111111] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </motion.button>
                      </form>
                    </TabsContent>

                    <TabsContent value="phone" className="mt-0">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-semibold text-pastel-dark">
                              Phone Number
                            </Label>
                            <div className="flex items-center">
                              <span className="inline-flex items-center px-4 h-12 rounded-l-xl border-2 border-r-0 border-pastel-dark bg-pastel-gray text-pastel-dark text-sm font-semibold shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                                +91
                              </span>
                              <Input
                                id="phone"
                                name="phone"
                                placeholder="Enter your phone number"
                                required
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="h-12 bg-white border-2 border-pastel-dark rounded-r-xl rounded-l-none px-4 text-base focus-visible:ring-2 focus-visible:ring-pastel-purple focus-visible:border-pastel-purple shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all"
                              />
                            </div>
                          </div>
                        </div>
                        <motion.button
                          type="submit"
                          disabled={loading}
                          whileTap={{ scale: 0.96 }}
                          whileHover={{
                            y: -2,
                            x: -2,
                            boxShadow: "5px 5px 0px 0px rgba(17,17,17,1)",
                            transition: { type: "spring", stiffness: 400, damping: 15 }
                          }}
                          className="w-full px-6 py-3 rounded-full font-heading font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden select-none bg-[#DDFCE5] text-[#111111] border-2 border-[#111111] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="relative z-10">
                            {loading ? 'Sending...' : 'Send OTP'}
                          </span>
                        </motion.button>
                      </form>
                    </TabsContent>
                  </Tabs>

                  {/* Toggle Login/Signup */}
                  <div className="mt-6 text-center">
                    <button
                      onClick={toggleForm}
                      className="text-sm text-gray-700 hover:text-pastel-dark font-semibold transition-colors"
                    >
                      {isLogin ? (
                        <>
                          Don't have an account? <span className="text-pastel-purple">Sign up</span>
                        </>
                      ) : (
                        <>
                          Already have an account? <span className="text-pastel-purple">Login</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Google Login */}
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-pastel-dark/20" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-cream px-3 text-gray-600 font-semibold">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full mt-4 h-12 bg-white border-2 border-pastel-dark rounded-xl shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] flex items-center justify-center gap-3 font-semibold text-pastel-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.251,44,34,44,30C44,22.659,43.862,21.35,43.611,20.083z" />
                      </svg>
                      Continue with Google
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};
