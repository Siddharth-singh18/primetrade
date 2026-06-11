'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Edit2, Trash2 } from 'lucide-react';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  high: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};

const statusColors = {
  todo: 'bg-zinc-500/10 text-zinc-400',
  'in-progress': 'bg-blue-500/10 text-blue-400',
  done: 'bg-[#7c3aed]/10 text-[#7c3aed]',
};

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5 hover:border-[#333333] transition-all group"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-zinc-100 group-hover:text-white transition-colors">{task.title}</h3>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(task)} className="p-1.5 text-zinc-500 hover:text-[#7c3aed] bg-[#1a1a1a] rounded-md transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={() => onDelete(task._id)} className="p-1.5 text-zinc-500 hover:text-red-500 bg-[#1a1a1a] rounded-md transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-sm text-zinc-500 mb-4 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 items-center mt-auto pt-4 border-t border-[#1f1f1f]">
        <span className={`text-xs px-2.5 py-1 rounded-full border ${priorityColors[task.priority]} font-medium uppercase tracking-wider`}>
          {task.priority}
        </span>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium uppercase tracking-wider ${statusColors[task.status]}`}>
          {task.status.replace('-', ' ')}
        </span>
        
        {task.dueDate && (
          <div className="flex items-center text-xs text-zinc-500 ml-auto">
            <Calendar size={14} className="mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </motion.div>
  );
};
