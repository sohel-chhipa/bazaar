import { useEffect, useState } from "react";

interface Countdown {
  hours: number;
  minutes: number;
  seconds: number;
}

const getRemainingUntilEndOfDay = (): Countdown => {
  const dayEnd = new Date();
  dayEnd.setHours(23, 59, 59, 999);

  const diff = Math.max(dayEnd.getTime() - Date.now(), 0);

  return {
    hours: Math.floor(diff / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
};

export const useCountdownTimer = () => {
  const [time, setTime] = useState<Countdown>(getRemainingUntilEndOfDay());

  useEffect(() => {
    const id = window.setInterval(() => {
      setTime(getRemainingUntilEndOfDay());
    }, 1000);

    return () => window.clearInterval(id);
  }, []);

  return time;
};
