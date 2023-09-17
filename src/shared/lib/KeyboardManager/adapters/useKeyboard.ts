import { useEffect, useRef } from 'react';

import { addCallback } from '../core';
import {Callback, CallbackEventType, Key} from '../types';

type Props = {
  key: Key;
  callback: Callback;
  disabled?: boolean;
  isGlobal?: boolean;
  type?: CallbackEventType
};

export const useKeyboard = ({ key, callback, disabled = false, type = 'keydown', isGlobal }: Props) => {
  const removeCallback = useRef<VoidFunction | null>(null)

  const callbackId = useRef(crypto.randomUUID()).current

  useEffect(() => {
    return () => {
      removeCallback.current?.()
    }
  }, []);

  useEffect(() => {

    removeCallback.current = addCallback({
      key,
      wrappedCallback: {
        callback,
        disabled,
        id: callbackId,
      },
      isGlobal,
      type
    })
  }, [key, disabled]);
};
