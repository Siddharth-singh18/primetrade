'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [usersRes, tasksRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/tasks')
      ]);
      setUsers(usersRes.data.data);
      setTasks(tasksRes.data.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      toast.success('Role updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#7c3aed]" size={40} />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
            <ShieldAlert className="mr-3 text-[#7c3aed]" size={32} />
            Admin Dashboard
          </h1>
          <p className="text-zinc-400 mt-1">Manage users and oversee all tasks</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Users Table */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-[#1f1f1f] bg-[#151515]">
              <h2 className="text-lg font-semibold text-white">System Users ({users.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0a0a0a] text-zinc-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Tasks</th>
                    <th className="px-5 py-3 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f]">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-[#151515] transition-colors">
                      <td className="px-5 py-4 text-zinc-300">{user.email}</td>
                      <td className="px-5 py-4 text-zinc-500">{user.taskCount}</td>
                      <td className="px-5 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="bg-[#0a0a0a] border border-[#333] text-xs rounded px-2 py-1 text-white focus:outline-none focus:border-[#7c3aed]"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tasks Overview */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-[#1f1f1f] bg-[#151515]">
              <h2 className="text-lg font-semibold text-white">All Tasks Overview ({tasks.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0a0a0a] text-zinc-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Title</th>
                    <th className="px-5 py-3 font-medium">Owner</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f]">
                  {tasks.slice(0, 10).map((task) => (
                    <tr key={task._id} className="hover:bg-[#151515] transition-colors">
                      <td className="px-5 py-4 text-zinc-300 truncate max-w-[200px]">{task.title}</td>
                      <td className="px-5 py-4 text-zinc-500 truncate max-w-[150px]">
                        {task.userId?.email || 'Unknown'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium ${
                          task.status === 'done' ? 'bg-[#7c3aed]/10 text-[#7c3aed]' :
                          task.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-zinc-500/10 text-zinc-400'
                        }`}>
                          {task.status.replace('-', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tasks.length > 10 && (
                <div className="p-3 text-center text-xs text-zinc-500 bg-[#0a0a0a]">
                  Showing 10 most recent tasks
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
