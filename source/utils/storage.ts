import {browser} from 'webextension-polyfill-ts';

// Core Extensions settings props
export type ExtensionStorageProperties = {
  passphrase?: {
    phrase: string;
    updated: Date;
  }
  username?: string
};

// update extension settings in browser storage
export function saveExtensionStorage(storage: any): Promise<void> {
  return browser.storage.local.set({
    storage,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getExtensionStorage(): Promise<{[s: string]: any}> {
  return browser.storage.local.get('storage');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateExtensionStorage(newFields?: {
  [s: string]: any;
}): Promise<void> {
  const {storage = {}} = await getExtensionStorage();

  return saveExtensionStorage({...storage, ...newFields});
}

// ToDo: Remove in the next major release
export function migrateSettings(storage: any): Promise<void> {
  // clear all keys
  browser.storage.local.clear();

  return browser.storage.local.set({
    storage,
  });
}

// // ToDo: Remove in the next major release
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function getPreviousSettings(): Promise<{[s: string]: any}> {
//   return browser.storage.local.get(null);
// }
