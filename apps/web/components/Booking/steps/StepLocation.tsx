import { useState } from 'react';
import dayjs from '@calcom/dayjs';
import { trpc } from '@/app/_trpc/client';

export default function StepLocation({ onNext, setBookingData, eventTypeId }: { onNext: () => void; setBookingData: any; eventTypeId: number }) {
  const [ville, setVille] = useState('');
  const [slots, setSlots] = useState<{ startTime: string; optimized?: boolean }[]>([]);

  const fetchSlots = async () => {
    const res = await trpc.geoPlanner.getSlots.query({ ville, eventTypeId, date: dayjs().format('YYYY-MM-DD') });
    setSlots(res as any);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Où souhaitez-vous votre intervention&nbsp;?</h2>
      <input className="border p-2 w-full" placeholder="Ville (ex : Montargis)" value={ville} onChange={e => setVille(e.target.value)} />
      <button onClick={fetchSlots} className="bg-black text-white px-4 py-2 mt-3">Voir les créneaux</button>

      {slots.map(s => (
        <div key={s.startTime} className="mt-2">
          {dayjs(s.startTime).format('HH:mm')} {s.optimized && '🟢 -10 €'}
          <button className="ml-2 underline" onClick={() => { setBookingData((p: any) => ({ ...p, villeSouhaitee: ville, slot: s })); onNext(); }}>
            Choisir
          </button>
        </div>
      ))}
    </div>
  );
}
