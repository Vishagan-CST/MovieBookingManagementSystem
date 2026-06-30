import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import { Button, TextField } from '@mui/material';
import { Block, CheckCircle } from '@mui/icons-material';

export const CustomerManagement: React.FC = () => {
  const { users, bookings, disableUser } = useApp();
  const [search, setSearch] = useState('');

  // Filter customers only
  const customers = useMemo(() => {
    return users.filter(u => u.role === 'customer');
  }, [users]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search))
    );
  }, [customers, search]);

  const handleToggleBlock = (userId: string, currentBlockedStatus: boolean) => {
    disableUser(userId, !currentBlockedStatus);
  };

  const breadcrumbs = [
    { label: 'Admin Dashboard', path: '/admin' },
    { label: 'Customer Management' }
  ];

  return (
    <div className="space-y-8">
      <Header title="Customer Directory" breadcrumbs={breadcrumbs} />

      {/* Filter and search controls */}
      <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        <TextField
          size="small"
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ input: { color: 'white' }, width: { xs: '100%', sm: 300 } }}
        />

        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total: {filteredCustomers.length} registered profiles</span>
      </div>

      {/* Customers List Table */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-black/25 text-gray-500 font-bold border-b border-white/5">
                <th className="p-4 uppercase tracking-wider">Customer Name</th>
                <th className="p-4 uppercase tracking-wider">Email Address</th>
                <th className="p-4 uppercase tracking-wider">Phone</th>
                <th className="p-4 uppercase tracking-wider">Booking Count</th>
                <th className="p-4 uppercase tracking-wider">Account Access</th>
                <th className="p-4 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => {
                const customerBookingsCount = bookings.filter(b => b.userId === c.id).length;
                const isBlocked = c.status === 'disabled'; 
                return (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={c.avatarUrl} alt={c.name} className="w-9 h-9 rounded-full object-cover border border-white/5" />
                        <h4 className="font-bold text-white text-sm">{c.name}</h4>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-white font-mono">{c.email}</td>
                    <td className="p-4 text-gray-300 font-mono">{c.phone || 'N/A'}</td>
                    <td className="p-4 text-[#FFD700] font-black text-sm">{customerBookingsCount} tickets</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        !isBlocked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {!isBlocked ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleToggleBlock(c.id, isBlocked)}
                        startIcon={isBlocked ? <CheckCircle /> : <Block />}
                        sx={{
                          py: 0.5,
                          px: 1.5,
                          fontSize: '10px',
                          color: isBlocked ? '#34D399' : '#FF6B6B',
                          borderColor: isBlocked ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                          '&:hover': {
                            borderColor: isBlocked ? '#34D399' : '#FF6B6B',
                            bgcolor: isBlocked ? 'rgba(52, 211, 153, 0.05)' : 'rgba(255, 107, 107, 0.05)'
                          }
                        }}
                      >
                        {isBlocked ? 'Restore Profile' : 'Block Profile'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default CustomerManagement;
