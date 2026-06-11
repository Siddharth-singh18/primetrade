'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Task } from './TaskCard';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  initialData?: Task | null;
  isLoading?: boolean;
}

export const TaskModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }: TaskModalProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description || '',
        status: initialData.status,
        priority: initialData.priority,
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      reset({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#111111] border border-[#1f1f1f] rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex justify-between items-center p-6 border-b border-[#1f1f1f]">
            <h2 className="text-xl font-semibold text-white">
              {initialData ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit((data) => {
            const payload = { ...data };
            if (!payload.dueDate) {
              delete payload.dueDate;
            } else if (payload.dueDate.length === 10) {
              // Convert YYYY-MM-DD to ISO-8601 to satisfy backend datetime validation
              payload.dueDate = new Date(payload.dueDate).toISOString();
            }
            onSubmit(payload);
          })} className="p-6 space-y-4 text-sm">
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Title</label>
              <input
                {...register('title')}
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
                placeholder="e.g. Implement authentication"
              />
              {errors.title && <p className="text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
                placeholder="Add more details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 mb-1.5 font-medium">Status</label>
                <select
                  {...register('status')}
                  className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all appearance-none"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1.5 font-medium">Priority</label>
                <select
                  {...register('priority')}
                  className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all appearance-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Due Date</label>
              <input
                type="date"
                {...register('dueDate')}
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-[#1f1f1f] mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-zinc-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Task')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
