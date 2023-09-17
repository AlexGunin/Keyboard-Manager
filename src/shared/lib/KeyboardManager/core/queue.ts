import {Queue, Key, WrappedCallback, WrapperCallbackId, CallbackEventType} from '../types';

export const GLOBAL_QUEUE_KEY = Symbol('global_queue')

const keyToQueue: Record<CallbackEventType,Record<Key, Queue>> = {
  keydown: {
    [GLOBAL_QUEUE_KEY]: []
  },
  keyup: {
    [GLOBAL_QUEUE_KEY]: []
  },
};
export const eventHandlers = new Map<WrapperCallbackId, WrappedCallback>();

export const allQueuesAreEmpty = (type: CallbackEventType): boolean => Object.values(keyToQueue[type]).every((queue) => queue.length === 0)

export const getQueue = (key: Key, type: CallbackEventType): Queue | undefined => keyToQueue[type][key]

export const getGlobalQueue = (type: CallbackEventType): Queue | undefined => keyToQueue[type][GLOBAL_QUEUE_KEY]

export const deleteEventHandler = (id: WrapperCallbackId) => eventHandlers.delete(id)

export const addOrUpdateCallbackInQueue = (queue: Queue, wrappedCallback: WrappedCallback) => {
  if(!isAlreadyUseCallback(wrappedCallback.id)) {
    queue.push(wrappedCallback.id)
  }

  eventHandlers.set(wrappedCallback.id, wrappedCallback)
}

export const getEventHandlerById = (id: WrapperCallbackId) => eventHandlers.get(id)

export const isAlreadyUseCallback = (id: WrapperCallbackId) => eventHandlers.has(id)

export const getLastNonDisabledEventHandler = (queue: Queue) => {

  for (let i = queue.length - 1; i >= 0; i--) {
    const id = queue[i]
    const handler = getEventHandlerById(id);

    if(handler && !handler.disabled) return handler
  }

  return null
}

export const getOrCreateQueue = (key: Key, type: CallbackEventType): Queue => {
  const queue = getQueue(key, type);
  if (queue) {
    return queue;
  }
  const newQueue: Queue = [];
  keyToQueue[type][key] = newQueue;
  return newQueue;
};
