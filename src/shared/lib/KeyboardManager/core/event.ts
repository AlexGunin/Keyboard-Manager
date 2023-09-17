import {getEventHandlerById, getGlobalQueue, getLastNonDisabledEventHandler, getQueue} from './queue';
import {getEventCodeWithModifiers} from "@/shared/lib/KeyboardManager/core/event-code.ts";
import {CallbackEventType} from "@/shared/lib/KeyboardManager/types.ts";

const createHandleOnKey = (type: CallbackEventType) => (event: KeyboardEvent) => {
  const code = getEventCodeWithModifiers(event);

  const queue = getQueue(code, type);
  const globalQueue = getGlobalQueue(type);

  globalQueue?.forEach(id => getEventHandlerById(id)?.callback(event))

  if (!queue || queue.length === 0) {
    return;
  }

  const wrappedCallback = getLastNonDisabledEventHandler(queue)

  if(!wrappedCallback || !wrappedCallback?.callback) return

  wrappedCallback.callback(event);
};

const onKeyDown = createHandleOnKey('keydown')

const onKeyUp = createHandleOnKey('keyup')

export const addEventListener = (type: CallbackEventType): void => {
  if(type === 'keydown') {
    window.addEventListener('keydown', onKeyDown);
  } else {
    window.addEventListener('keyup', onKeyUp);
  }
};

export const removeEventListener = (type: CallbackEventType): void => {
  if(type === 'keydown') {
    window.removeEventListener('keydown', onKeyDown);
  } else {
    window.removeEventListener('keyup', onKeyUp);
  }
};
