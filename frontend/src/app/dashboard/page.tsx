'use client';

import { useState, useEffect } from 'react';
import { Plus, ListTodo, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { TaskCard, Task } from '@/components/TaskCard';
import { TaskModal } from '@/components/TaskModal';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateOrUpdateTask = async (data: any) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, data);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', data);
        toast.success('Task created');
      }
      fetchTasks();
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter((task) => filter === 'all' || task.status === filter);

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Tasks</h1>
          <p className="text-zinc-400 mt-1">Manage and organize your workflow</p>
        </div>
        <button
          onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
          className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(124,58,237,0.2)] flex items-center shrink-0"
        >
          <Plus size={20} className="mr-2" /> New Task
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: stats.total, color: 'text-zinc-100' },
          { label: 'To Do', value: stats.todo, color: 'text-zinc-400' },
          { label: 'In Progress', value: stats.inProgress, color: 'text-blue-400' },
          { label: 'Done', value: stats.done, color: 'text-[#7c3aed]' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5">
            <div className="text-sm text-zinc-400 font-medium mb-1">{stat.label}</div>
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2 border-b border-[#1f1f1f] pb-px">
        {['all', 'todo', 'in-progress', 'done'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === f
                ? 'border-[#7c3aed] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#7c3aed]" size={40} />
        </div>
      ) : filteredTasks.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }}
                onDelete={handleDeleteTask}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-[#111111] border border-[#1f1f1f] border-dashed rounded-2xl">
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-500">
            <ListTodo size={32} />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No tasks found</h3>
          <p className="text-zinc-500 max-w-sm mx-auto">
            {filter === 'all' ? "You don't have any tasks yet. Create one to get started." : `You don't have any tasks in the ${filter} state.`}
          </p>
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
        onSubmit={handleCreateOrUpdateTask}
        initialData={editingTask}
      />
    </div>
  );
}
