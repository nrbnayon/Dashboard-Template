"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Mail, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signupValidationSchema } from "@/lib/formDataValidation";

type SignupFormData = z.infer<typeof signupValidationSchema>;

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupValidationSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const agreeToTerms = watch("agreeToTerms");
  const password = watch("password");

  interface SignupFormResponse {
    full_name: string;
    email: string;
    password: string;
    agreeToTerms: boolean;
    timestamp: string;
    userAgent: string;
  }

  // Prevent spaces in email and password fields
  const handleEmailKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault();
      toast.error("Spaces are not allowed in email addresses");
    }
  };

  const handleEmailPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    if (pastedText.includes(" ")) {
      e.preventDefault();
      toast.error("Spaces are not allowed in email addresses");
    }
  };

  const handlePasswordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault();
      toast.error("Spaces are not allowed in passwords");
    }
  };

  const handlePasswordPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    if (pastedText.includes(" ")) {
      e.preventDefault();
      toast.error("Spaces are not allowed in passwords");
    }
  };

  const onSubmit = async (data: SignupFormData): Promise<void> => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise<void>((resolve) => setTimeout(resolve, 2000));

      // Log the form data to console
      console.log("Signup Form Data:", {
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        agreeToTerms: data.agreeToTerms,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      } as SignupFormResponse);

      // Simulate successful signup
      toast.success("Account created successfully!", {
        description: `Welcome ${data.full_name}! Please check your email to verify your account.`,
        duration: 3000,
      });

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: unknown) {
      console.error("Signup error:", error);
      toast.error("Registration failed", {
        description: "Something went wrong. Please try again later.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignup = () => {
    setValue("full_name", "John Doe");
    setValue("email", "john.doe@example.com");
    setValue("password", "Demo123456");
    setValue("confirmPassword", "Demo123456");
    toast.info("Demo information filled", {
      description: "Please check the terms and conditions checkbox to continue",
    });
  };

  // Password strength indicator
  interface PasswordStrengthResult {
    strength: number;
    label: string;
    color: string;
  }

  const getPasswordStrength = (password: string): PasswordStrengthResult => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const labels: string[] = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors: string[] = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];

    return {
      strength,
      label: labels[strength - 1] || "",
      color: colors[strength - 1] || "",
    };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className='min-h-screen flex bg-white dark:bg-primary-dark'>
      {/* Left Side - Welcome Message */}
      <div className='flex-1 bg-sidebar-gradient dark:bg-primary-dark flex items-center justify-center p-8 text-white'>
        <div className='max-w-md text-center space-y-6'>
          <div className='w-full flex justify-center items-center'>
            <Image src='/logo.png' alt='logo' width={200} height={200} />
          </div>
          <h1 className='text-4xl leading-tight'>Join Us Today!</h1>
          <p className='text-lg opacity-90'>
            Create your account and get started with our amazing platform
          </p>
          <div className='pt-4 space-y-3'>
            <Button
              variant='outline'
              onClick={handleDemoSignup}
              className='bg-white/10 border-white/20 text-white hover:text-white hover:bg-white/20 w-full backdrop-blur-sm'
            >
              Fill Demo Information
            </Button>
            <p className='text-sm opacity-75'>
              Already have an account?{" "}
              <Link
                href='/login'
                className='text-white underline hover:opacity-80'
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className='flex-1 bg-white dark:bg-primary-dark flex items-center justify-center p-8'>
        <Card className='w-full p-2 lg:p-10 max-w-2xl rounded-4xl border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800'>
          <CardHeader className='text-center pb-6'>
            <h2 className='text-2xl text-gray-900 dark:text-white mb-2'>
              Create Your Account
            </h2>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>
              Already have an account?{" "}
              <Link
                href='/login'
                className='text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500 dark:hover:text-indigo-300'
              >
                Sign In
              </Link>
            </p>
          </CardHeader>

          <CardContent>
            <div className='space-y-6'>
              {/* Full Name Field */}
              <div className='space-y-2'>
                <label
                  htmlFor='full_name'
                  className='text-gray-900 dark:text-white text-sm block'
                >
                  Full Name
                </label>
                <div className='relative'>
                  <Input
                    id='full_name'
                    type='text'
                    placeholder='Enter your full name'
                    className={`pl-4 pr-10 h-12 bg-gray-50 rounded-md dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 border ${
                      errors.full_name
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                    } focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20`}
                    {...register("full_name")}
                    disabled={isLoading}
                  />
                  <User className='absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500' />
                </div>
                {errors.full_name && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Email Field - Option 1: Prevent spaces with warnings */}
              <div className='space-y-2'>
                <label
                  htmlFor='email'
                  className='text-gray-900 dark:text-white text-sm block'
                >
                  Email Address
                </label>
                <div className='relative'>
                  <Input
                    id='email'
                    type='email'
                    placeholder='Enter your email address'
                    className={`pl-4 pr-10 h-12 bg-gray-50 rounded-md dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 border ${
                      errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                    } focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20`}
                    {...register("email")}
                    onKeyPress={handleEmailKeyPress}
                    onPaste={handleEmailPaste}
                    disabled={isLoading}
                  />
                  <Mail className='absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500' />
                </div>
                {errors.email && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.email.message}
                  </p>
                )}
              </div>
              {/* Password Field - */}
              <div className='space-y-2'>
                <label
                  htmlFor='password'
                  className='text-gray-900 dark:text-white text-sm block'
                >
                  Password
                </label>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? "text" : "password"}
                    placeholder='Create a strong password'
                    className={`pl-4 pr-10 h-12 bg-gray-50 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 border ${
                      errors.password
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                    } focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20`}
                    {...register("password")}
                    onKeyPress={handlePasswordKeyPress}
                    onPaste={handlePasswordPaste}
                    disabled={isLoading}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5' />
                    ) : (
                      <Eye className='h-5 w-5' />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className='space-y-1'>
                    <div className='flex space-x-1'>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full ${
                            level <= passwordStrength.strength
                              ? passwordStrength.color
                              : "bg-gray-200 dark:bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    {passwordStrength.label && (
                      <p
                        className={`text-xs ${
                          passwordStrength.strength >= 4
                            ? "text-green-600 dark:text-green-400"
                            : passwordStrength.strength >= 3
                            ? "text-blue-600 dark:text-blue-400"
                            : passwordStrength.strength >= 2
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        Password strength: {passwordStrength.label}
                      </p>
                    )}
                  </div>
                )}

                {errors.password && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className='space-y-2'>
                <label
                  htmlFor='confirmPassword'
                  className='text-gray-900 dark:text-white text-sm block'
                >
                  Confirm Password
                </label>
                <div className='relative'>
                  <Input
                    id='confirmPassword'
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder='Confirm your password'
                    className={`pl-4 pr-10 h-12 bg-gray-50 rounded-md dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 border ${
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                    } focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20`}
                    {...register("confirmPassword")}
                    onKeyPress={handlePasswordKeyPress}
                    onPaste={handlePasswordPaste}
                    disabled={isLoading}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='h-5 w-5' />
                    ) : (
                      <Eye className='h-5 w-5' />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className='space-y-3'>
                <div className='flex items-start space-x-3'>
                  <Checkbox
                    id='agreeToTerms'
                    className={`border-gray-300 dark:border-gray-600 mt-0.5 ${
                      errors.agreeToTerms ? "border-red-500" : ""
                    }`}
                    checked={agreeToTerms}
                    onCheckedChange={(checked) =>
                      setValue("agreeToTerms", !!checked)
                    }
                    disabled={isLoading}
                  />
                  <label
                    htmlFor='agreeToTerms'
                    className='text-gray-600 dark:text-gray-400 text-sm cursor-pointer leading-relaxed'
                  >
                    I agree to the{" "}
                    <Link
                      href='/terms'
                      className='text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500 dark:hover:text-indigo-300'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href='/privacy'
                      className='text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500 dark:hover:text-indigo-300'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className='text-red-500 text-xs ml-7'>
                    {errors.agreeToTerms.message}
                  </p>
                )}
              </div>

              {/* Signup Button */}
              <Button
                onClick={handleSubmit(onSubmit)}
                className='w-full h-12 bg-primary/80 hover:bg-primary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500/20'
                disabled={isLoading || isSubmitting}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className='mr-2 h-4 w-4' />
                    Create Account
                  </>
                )}
              </Button>
            </div>

            {/* Additional Info */}
            <div className='mt-6 text-center space-y-2'>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                By creating an account, you&apos;ll receive email notifications
                about your account activity and our services.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
