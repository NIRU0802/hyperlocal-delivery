export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${mins} min`;
}

export function isRestaurantOpen(openingTime: string, closingTime: string): {
  isOpen: boolean;
  label: string;
  reason?: string;
} {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinutes;
  
  const [openH, openM] = openingTime.split(':').map(Number);
  const [closeH, closeM] = closingTime.split(':').map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  
  if (currentTime < openMinutes) {
    return { 
      isOpen: false, 
      label: 'Closed',
      reason: `Opens at ${formatTime12Hour(openingTime)}`
    };
  }
  
  if (currentTime >= closeMinutes) {
    return { 
      isOpen: false, 
      label: 'Closed',
      reason: `Closes at ${formatTime12Hour(closingTime)}`
    };
  }
  
  const minutesLeft = closeMinutes - currentTime;
  if (minutesLeft <= 30) {
    return { 
      isOpen: true, 
      label: 'Closing Soon',
      reason: `Closes in ${minutesLeft} min`
    };
  }
  
  return { isOpen: true, label: 'Open' };
}

export function formatTime12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function getEstimatedDeliveryTime(deliveryTime: number): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + deliveryTime);
  return formatTime12Hour(`${now.getHours()}:${now.getMinutes()}`);
}

export function getTimeRemaining(targetDate: string | Date): {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const diff = target - now;
  
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds, isExpired: false };
}

export function formatOrderPlacedTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) {
    return 'Just now';
  }
  
  if (diffMins < 60) {
    return `${diffMins} min ago`;
  }
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }
  
  return date.toLocaleDateString();
}
