import { Vibration, Platform } from 'react-native';
import { HapticType, IHapticService } from '@superapp/core-contracts';

/**
 * Quản lý rung máy (Haptic Feedback) khi quét mã thành công hoặc báo lỗi
 */
class HapticService implements IHapticService {
  trigger(type: HapticType): void {
    if (Platform.OS === 'android') {
      switch (type) {
        case 'notificationSuccess':
          Vibration.vibrate([0, 50, 50, 50]); // 2 nhịp ngắn
          break;
        case 'notificationError':
          Vibration.vibrate([0, 150, 80, 150]); // 2 nhịp dài
          break;
        case 'impactLight':
        case 'selection':
          Vibration.vibrate(30); // 1 nhịp siêu ngắn
          break;
        case 'impactHeavy':
          Vibration.vibrate(100);
          break;
        default:
          Vibration.vibrate(50);
          break;
      }
    } else {
      // iOS
      Vibration.vibrate();
    }
  }

  success(): void {
    this.trigger('notificationSuccess');
  }

  error(): void {
    this.trigger('notificationError');
  }

  light(): void {
    this.trigger('impactLight');
  }

  selection(): void {
    this.trigger('selection');
  }
}

export const hapticService = new HapticService();
