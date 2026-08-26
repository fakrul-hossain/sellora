'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { History } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await ApiClient.get<any[]>('/admin/activity-logs');
        setLogs(data);
      } catch (err) {
        console.error('Failed to fetch audit logs:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 font-sans text-slate-800 antialiased">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <History className="w-5 h-5 text-purple-600" />
          <span>System Audit Activity Trail</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Append-only audit trail logging all administrative actions, vendor status updates, role updates, and settings changes.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading activity logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No activity logs recorded yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Admin / User</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Target ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-sans text-slate-500 text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-bold text-slate-900">{log.userName}</td>
                    <td className="py-3.5 px-4 font-bold text-brand-primary text-[11px]">{log.action}</td>
                    <td className="py-3.5 px-4 font-sans text-slate-600 font-semibold">{log.module}</td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">{log.targetId || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
