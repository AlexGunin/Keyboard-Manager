import {GLOBAL_QUEUE_KEY} from "@/shared/lib/KeyboardManager/core/queue.ts";

export type Key = KeyboardEvent['key'] | typeof GLOBAL_QUEUE_KEY;
export type Callback = (event: KeyboardEvent) => void;

export type WrapperCallbackId = string

export type WrappedCallback = { callback: Callback, disabled: boolean, id: WrapperCallbackId };

export type Queue = WrapperCallbackId[];

export type CallbackEventType = 'keyup' | 'keydown'