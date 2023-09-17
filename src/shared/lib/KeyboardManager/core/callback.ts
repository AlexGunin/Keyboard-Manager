import {
  addOrUpdateCallbackInQueue,
  allQueuesAreEmpty,
  deleteEventHandler,
  getOrCreateQueue,
  GLOBAL_QUEUE_KEY
} from './queue';
import {addEventListener, removeEventListener} from './event';
import {CallbackEventType, Key, Queue, WrappedCallback} from '../types';

type RemoveParams = {
  queue: Queue;
  wrappedCallback: WrappedCallback;
  type: CallbackEventType
};
const removeCallback = ({ queue, wrappedCallback, type }: RemoveParams) => {
  const index = queue.findIndex(
    (id) => id === wrappedCallback.id
  );
  if (index > -1) {
    queue.splice(index, 1);
  }
  if (allQueuesAreEmpty(type)) {
    removeEventListener(type);
  }
  deleteEventHandler(wrappedCallback.id)
  console.log('remove callback', queue)
};

type AddParams = {
  key: Key;
  wrappedCallback: WrappedCallback;
  isGlobal?: boolean;
  type: CallbackEventType;
};


export const addCallback = ({ key, wrappedCallback, isGlobal, type }: AddParams) => {
  const needAddEventListener = allQueuesAreEmpty(type);
  const queue = getOrCreateQueue(isGlobal ? GLOBAL_QUEUE_KEY: key, type);

  addOrUpdateCallbackInQueue(queue, wrappedCallback)

  if (needAddEventListener) {
    addEventListener(type);
  }
  console.log('add callback', queue)
  return () => removeCallback({ queue, wrappedCallback, type });
};
