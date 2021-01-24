import { useContext } from 'react';
import {
  DialogContextData,
  DialogContext,
} from '../../contexts/DialogContext/DialogContext';

export default function useDialog(): DialogContextData {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('useDialog must be used within an DialogProvider');
  }

  return context;
}
