import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { Card, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Email, Reply } from '@mui/icons-material';
import toast from 'react-hot-toast';

export const Inquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('http://localhost:5068/api/inquiries');
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleOpenReply = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setReplyMessage('');
    setReplyDialogOpen(true);
  };

  const handleCloseReply = () => {
    setReplyDialogOpen(false);
    setSelectedInquiry(null);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message.');
      return;
    }
    
    setSendingReply(true);
    try {
      const response = await fetch(`http://localhost:5068/api/inquiries/${selectedInquiry.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage })
      });
      if (response.ok) {
        toast.success('Reply sent to user and inquiry resolved!');
        setReplyDialogOpen(false);
        fetchInquiries();
      } else {
        toast.error('Failed to send reply');
      }
    } catch (err) {
      toast.error('Error sending reply');
    } finally {
      setSendingReply(false);
    }
  };



  const breadcrumbs = [
    { label: 'Admin Dashboard', path: '/admin' },
    { label: 'User Inquiries' }
  ];

  return (
    <div className="space-y-8">
      <Header title="User Inquiries" breadcrumbs={breadcrumbs} />

      {loading ? (
        <div className="text-gray-400 text-center py-10">Loading inquiries...</div>
      ) : inquiries.length === 0 ? (
        <div className="bg-[#1A1A1A] p-12 text-center rounded-2xl border border-white/5">
          <Email className="text-gray-600 mb-3 mx-auto" sx={{ fontSize: 48 }} />
          <p className="text-sm text-gray-400">No inquiries found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inquiries.map((inquiry: any) => (
            <Card key={inquiry.id} sx={{ bgcolor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.05)', p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-white text-lg">{inquiry.subject}</h3>
                <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold ${
                  inquiry.status === 'Resolved' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {inquiry.status}
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-4 flex-grow">{inquiry.message}</p>
              
              <div className="bg-black/20 p-3 rounded-xl border border-white/5 mb-4">
                <p className="text-xs text-gray-400"><strong>From:</strong> {inquiry.name}</p>
                <p className="text-xs text-gray-400"><strong>Email:</strong> {inquiry.email}</p>
                <p className="text-xs text-gray-400"><strong>Phone:</strong> {inquiry.phone}</p>
                <p className="text-[10px] text-gray-500 mt-2">{new Date(inquiry.createdAt).toLocaleString()}</p>
              </div>

              {inquiry.status !== 'Resolved' && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Reply />}
                  onClick={() => handleOpenReply(inquiry)}
                  sx={{ mt: 'auto', borderRadius: 2, bgcolor: '#C1121F', '&:hover': { bgcolor: '#A00F19' } }}
                >
                  Reply & Resolve
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
      
      {/* Reply Dialog */}
      <Dialog 
        open={replyDialogOpen} 
        onClose={handleCloseReply}
        sx={{
          '& .MuiDialog-paper': { backgroundColor: '#1A1A1A', color: 'white', minWidth: '400px', border: '1px solid rgba(255,255,255,0.1)' }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', mb: 2 }}>
          Reply to {selectedInquiry?.name}
        </DialogTitle>
        <DialogContent>
          <div className="mb-4">
            <p className="text-xs text-gray-400"><strong>Subject:</strong> {selectedInquiry?.subject}</p>
            <p className="text-xs text-gray-400"><strong>Email:</strong> {selectedInquiry?.email}</p>
          </div>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            placeholder="Type your reply here..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#C1121F' },
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Button onClick={handleCloseReply} sx={{ color: 'gray' }}>Cancel</Button>
          <Button 
            onClick={handleSendReply} 
            disabled={sendingReply}
            variant="contained" 
            sx={{ bgcolor: '#C1121F', '&:hover': { bgcolor: '#A00F19' } }}
          >
            {sendingReply ? 'Sending...' : 'Send Reply'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Inquiries;
