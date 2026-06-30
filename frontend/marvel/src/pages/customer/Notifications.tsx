import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import { Card, IconButton } from '@mui/material';
import { Notifications as NotifIcon, Done, Circle } from '@mui/icons-material';

export const Notifications: React.FC = () => {
  const { notifications, currentUser, markNotificationRead } = useApp();

  const userNotif = useMemo(() => {
    return notifications.filter(n => n.userId === 'all' || n.userId === currentUser?.id);
  }, [notifications, currentUser]);

  const breadcrumbs = [
    { label: 'Dashboard', path: '/customer' },
    { label: 'Notifications' }
  ];

  return (
    <div className="space-y-8">
      <Header title="My Notifications" breadcrumbs={breadcrumbs} />

      {userNotif.length === 0 ? (
        <div className="bg-[#1A1A1A] p-12 text-center rounded-2xl border border-white/5">
          <NotifIcon className="text-gray-600 mb-3 mx-auto" sx={{ fontSize: 48 }} />
          <p className="text-sm text-gray-400">Your inbox is clear.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {userNotif.map((n) => (
            <Card
              key={n.id}
              sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderLeft: n.read ? '3px solid transparent' : '3px solid #C1121F',
                bgcolor: n.read ? '#1E1E1E' : 'rgba(193, 18, 31, 0.04)'
              }}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl mt-0.5 ${n.read ? 'bg-zinc-800 text-gray-500' : 'bg-[#C1121F]/10 text-[#C1121F]'}`}>
                  <NotifIcon />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm md:text-base font-bold ${n.read ? 'text-gray-400' : 'text-white'}`}>{n.title}</h4>
                    {!n.read && <Circle sx={{ fontSize: 8, color: '#C1121F' }} />}
                  </div>
                  <p className="text-xs md:text-sm text-gray-400 mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-gray-600 font-bold block mt-2 font-mono">
                    {new Date(n.date).toLocaleString()}
                  </span>
                </div>
              </div>

              {!n.read && (
                <IconButton
                  onClick={() => markNotificationRead(n.id)}
                  sx={{ color: '#FFD700', hover: { color: 'white' } }}
                  title="Mark as Read"
                >
                  <Done />
                </IconButton>
              )}
            </Card>
          ))}
        </div>
      )}

    </div>
  );
};

export default Notifications;
