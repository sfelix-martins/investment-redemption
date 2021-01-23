import React, { createContext, useCallback, useContext, useState } from 'react';

import Dialog from '../../components/Dialog/Dialog';

interface OpenDialogOptions {
  title?: string;
  message: string | null;
  actionText?: string;
}

interface DialogContextData {
  showSuccessDialog(options: OpenDialogOptions): void;
  showErrorDialog(options: OpenDialogOptions): void;
}

const DialogContext = createContext<DialogContextData>({} as DialogContextData);

const DialogProvider: React.FC = ({ children }) => {
  const [actionText, setActionText] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'success' | 'error'>('success');
  const [visible, setVisible] = useState(false);

  const handleDialogDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  const showDialog = useCallback(
    (options: OpenDialogOptions) => {
      setActionText(options.actionText ?? 'OK');
      setMessage(options.message);
      setTitle(options.title ?? (type === 'success' ? 'Sucesso' : 'Erro'));
      setVisible(true);
    },
    [type],
  );

  const showSuccessDialog = useCallback(
    (options: OpenDialogOptions) => {
      setType('success');
      showDialog(options);
    },
    [showDialog],
  );

  const showErrorDialog = useCallback(
    (options: OpenDialogOptions) => {
      setType('error');
      showDialog(options);
    },
    [showDialog],
  );

  return (
    <DialogContext.Provider value={{ showSuccessDialog, showErrorDialog }}>
      <Dialog
        onDismiss={handleDialogDismiss}
        actionText={actionText}
        message={message}
        title={title}
        type={type}
        visible={visible}
      />
      {children}
    </DialogContext.Provider>
  );
};

function useDialog(): DialogContextData {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('useDialog must be used within an DialogProvider');
  }

  return context;
}

export { DialogProvider, useDialog };
