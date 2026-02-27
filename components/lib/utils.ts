import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(0)}`;
}

export function getRestaurantStatus(openingTime: string, closingTime: string, busyMode: boolean) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = openingTime.split(':').map(Number);
  const [closeH, closeM] = closingTime.split(':').map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (currentTime < openMinutes || currentTime >= closeMinutes) {
    return { status: 'closed', label: 'Closed', color: 'bg-red-500' };
  }

  if (busyMode) {
    return { status: 'busy', label: 'Busy', color: 'bg-orange-500' };
  }

  if (currentTime >= closeMinutes - 30) {
    return { status: 'closing_soon', label: 'Closing Soon', color: 'bg-yellow-500' };
  }

  return { status: 'open', label: 'Open', color: 'bg-green-500' };
}

export function getTimeBasedMessage(openingTime: string, menuAvailableTime: string) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = openingTime.split(':').map(Number);
  const [menuH, menuM] = menuAvailableTime.split(':').map(Number);
  const openMinutes = openH * 60 + openM;
  const menuMinutes = menuH * 60 + menuM;

  if (currentTime < openMinutes) {
    return { show: true, message: `Opens at ${openingTime}` };
  }

  if (currentTime >= openMinutes && currentTime < menuMinutes) {
    return { show: true, message: 'Kitchen preparing menu...' };
  }

  return { show: false, message: '' };
}
