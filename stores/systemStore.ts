import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DemandLevel = 'LOW' | 'NORMAL' | 'HIGH';

interface SystemState {
  rainMode: boolean;
  demandLevel: DemandLevel;
  trafficDelay: boolean;
  setRainMode: (enabled: boolean) => void;
  setDemandLevel: (level: DemandLevel) => void;
  setTrafficDelay: (enabled: boolean) => void;
  getDeliveryFee: (baseFee: number) => number;
  getEtaBoost: (baseEta: number) => number;
}

export const useSystemStore = create<SystemState>()(
  persist(
    (set, get) => ({
      rainMode: false,
      demandLevel: 'NORMAL',
      trafficDelay: false,

      setRainMode: (enabled) => set({ rainMode: enabled }),
      setDemandLevel: (level) => set({ demandLevel: level }),
      setTrafficDelay: (enabled) => set({ trafficDelay: enabled }),

      getDeliveryFee: (baseFee: number) => {
        const { rainMode, demandLevel } = get();
        let fee = baseFee;
        if (rainMode) {
          fee = fee * 1.2;
        }
        if (demandLevel === 'HIGH') {
          fee = fee * 1.1;
        }
        return Math.round(fee);
      },

      getEtaBoost: (baseEta: number) => {
        const { rainMode, demandLevel, trafficDelay } = get();
        let eta = baseEta;
        if (rainMode) {
          eta += 5;
        }
        if (demandLevel === 'HIGH') {
          eta += 3;
        }
        if (trafficDelay) {
          eta += 5;
        }
        return eta;
      },
    }),
    {
      name: 'thequick-system',
    }
  )
);
