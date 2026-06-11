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

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      const { user, accessToken, refreshToken } = response.data.data;
      
      setAuth(user, accessToken, refreshToken);
      toast.success('Logged in successfully');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
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
        
        <h1 className="text-2xl font-semibold text-center text-white mb-2">Welcome back</h1>
        <p className="text-sm text-center text-zinc-400 mb-8">Enter your credentials to access TaskFlow</p>

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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg py-2.5 font-medium transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-[0_0_15px_rgba(124,58,237,0.2)]"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Sign In'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#1f1f1f]"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#111111] px-2 text-zinc-500">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => onSubmit({ email: 'demo@taskflow.com', password: 'password' })}
          className="w-full bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] text-white rounded-lg py-2.5 font-medium transition-all flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'View as Demo User'}
        </button>

        <p className="text-center text-zinc-500 text-sm mt-8">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#7c3aed] hover:text-[#a78bfa] transition-colors font-medium">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
