/**
 * Interfaces cho các dịch vụ Native do Host App cung cấp cho 5 Sub-app
 */

export type HapticType =
  | 'impactLight'
  | 'impactMedium'
  | 'impactHeavy'
  | 'notificationSuccess'
  | 'notificationWarning'
  | 'notificationError'
  | 'selection';

export interface IHapticService {
  trigger(type: HapticType): void;
}

export interface INotificationPayload {
  id?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface INotificationService {
  displayLocal(payload: INotificationPayload): Promise<void>;
  requestPermission(): Promise<boolean>;
}

export interface IStorageService {
  getString(key: string): string | undefined;
  setString(key: string, value: string): void;
  getNumber(key: string): number | undefined;
  setNumber(key: string, value: number): void;
  getBoolean(key: string): boolean | undefined;
  setBoolean(key: string, value: boolean): void;
  delete(key: string): void;
  clearAll(): void;
}

export interface INavigationService {
  openUrl(url: string): Promise<boolean>;
  canOpenUrl(url: string): Promise<boolean>;
  goBack(): void;
}
