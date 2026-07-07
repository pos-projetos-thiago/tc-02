'use client';

import { useState, useCallback } from 'react';

interface ToastState {
  isVisible: boolean;
  message: string;
  type: 'success' | 'info' | 'error';
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  }, []);

  const showSuccess = useCallback((message: string) => {
    showToast(message, 'success');
  }, [showToast]);

  const showError = useCallback((message: string) => {
    showToast(message, 'error');
  }, [showToast]);

  const showInfo = useCallback((message: string) => {
    showToast(message, 'info');
  }, [showToast]);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  return {
    toast,
    showToast,
    showSuccess,
    showError,
    showInfo,
    hideToast
  };
};
