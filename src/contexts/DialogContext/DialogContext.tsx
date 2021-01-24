import React, { createContext, useCallback, useState } from 'react';

import Dialog from '../../components/Dialog/Dialog';

interface OpenDialogOptions {
  title?: string;
  message: string | null;
  actionText?: string;
}

export interface DialogContextData {
  showSuccessDialog(options: OpenDialogOptions): void;
  showErrorDialog(options: OpenDialogOptions): void;
}

const DialogContext = createContext<DialogContextData>({} as DialogContextData);

const DialogProvider: React.FC = ({ children }) => {
  const [actionText, setActionText] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'success' | 'error' | undefined>(undefined);
  const [visible, setVisible] = useState(false);

  const handleDialogDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  const showDialog = useCallback(
    (options: OpenDialogOptions, dialogType: 'success' | 'error') => {
      setType(dialogType);
      setActionText(options.actionText ?? 'OK');
      setMessage(options.message);
      setTitle(
        options.title ?? (dialogType === 'success' ? 'Sucesso' : 'Erro'),
      );
      setVisible(true);
    },
    [],
  );

  const showSuccessDialog = useCallback(
    (options: OpenDialogOptions) => {
      showDialog(options, 'success');
    },
    [showDialog],
  );

  const showErrorDialog = useCallback(
    (options: OpenDialogOptions) => {
      showDialog(options, 'error');
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

export { DialogProvider, DialogContext };
