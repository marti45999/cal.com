import dayjs from '@calcom/dayjs';

export interface Slot {
  startTime: string;
}

export interface Booking {
  endTime: Date;
  metadata: any;
}

export function computeOptimizedSlots(
  slots: Slot[],
  bookings: Booking[],
  travelMinutes: number,
  ville: string,
) {
  const results: (Slot & { optimized?: boolean })[] = [];
  for (const slot of slots) {
    let hide = false;
    let optimized = false;
    const slotTime = dayjs(slot.startTime);
    const slotLength = (slot as any).length ?? 50;
    for (const booking of bookings) {
      const bVille = booking.metadata?.ville;
      if (!bVille || bVille === ville) continue;
      const end = dayjs(booking.endTime);
      const bufferEnd = end.add(slotLength + travelMinutes, 'minute');
      if (slotTime.isBefore(bufferEnd)) {
        hide = true;
        break;
      }
      if (slotTime.isSame(bufferEnd)) {
        optimized = true;
      }
    }
    if (!hide) {
      results.push({ ...slot, optimized });
    }
  }
  return results;
}
