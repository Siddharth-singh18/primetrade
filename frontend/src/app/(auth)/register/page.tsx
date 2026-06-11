'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', {
        email: data.email,
        password: data.password,
      });
      const { user, accessToken, refreshToken } = response.data.data;
      
      setAuth(user, accessToken, refreshToken);
      toast.success('Account created successfully');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1f1f1f] via-[#0a0a0a] to-[#0a0a0a] -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111111]/80 backdrop-blur-xl border border-[#1f1f1f] rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#7c3aed] flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)]">
            T
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold text-center text-white mb-2">Create an account</h1>
        <p className="text-sm text-center text-zinc-400 mb-8">Sign up to get started with TaskFlow</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="name@example.com"
              className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Password</label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Confirm Password</label>
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg py-2.5 font-medium transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-[0_0_15px_rgba(124,58,237,0.2)]"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-[#7c3aed] hover:text-[#a78bfa] transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
