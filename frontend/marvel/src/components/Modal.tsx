import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, maxWidth = 'sm' }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      slotProps={{
        paper: {
          style: {
            backgroundColor: '#1E1E1E',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            color: '#FFFFFF'
          }
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, fontFamily: 'Poppins' }}>
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.08)', p: 3 }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: 'error' | 'warning' | 'info';
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'info'
}) => {
  const getConfirmButtonColor = () => {
    if (severity === 'error') return 'error';
    if (severity === 'warning') return 'warning';
    return 'primary';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          style: {
            backgroundColor: '#1E1E1E',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            color: '#FFFFFF',
            padding: 8
          }
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontFamily: 'Poppins', color: severity === 'error' ? '#FF6B6B' : 'white' }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ color: '#BBB' }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            color: '#FFF',
            borderColor: 'rgba(255,255,255,0.15)',
            '&:hover': {
              borderColor: '#FFF',
              bgcolor: 'rgba(255,255,255,0.05)'
            }
          }}
        >
          {cancelText}
        </Button>
        <Button
          variant="contained"
          color={getConfirmButtonColor()}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
