import { z } from 'zod';
import { router, publicProcedure, createCallerFactory } from '@calcom/trpc/server/trpc';
import { bookingsRouter } from '@calcom/trpc/server/routers/viewer/bookings/_router';
import { slotsRouter } from '@calcom/trpc/server/routers/viewer/slots/_router';
import { computeOptimizedSlots } from './lib/computeOptimizedSlots';

const GetSlotsSchema = z.object({
  eventTypeId: z.number().int(),
  ville: z.string(),
  date: z.string() // ISO date
});

export const geoPlannerRouter = router({
  getSlots: publicProcedure.input(GetSlotsSchema).query(async ({ ctx, input }) => {
    const createBookingsCaller = createCallerFactory(bookingsRouter);
    const bookingsCaller = createBookingsCaller(ctx);
    const { bookings } = await bookingsCaller.get({
      limit: 50,
      offset: 0,
      filters: { status: 'upcoming' },
    });

    const createSlotsCaller = createCallerFactory(slotsRouter);
    const slotsCaller = createSlotsCaller(ctx);
    const { slots } = await slotsCaller.getSchedule({
      startTime: `${input.date}T00:00:00Z`,
      endTime: `${input.date}T23:59:59Z`,
      eventTypeId: input.eventTypeId,
    });

    const optimized = computeOptimizedSlots(slots, bookings, 50, input.ville);
    return optimized;
  })
});

export type GeoPlannerRouter = typeof geoPlannerRouter;
