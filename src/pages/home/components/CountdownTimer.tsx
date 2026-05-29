import { useCountdownTimer } from "@/shared/hooks/useCountdownTimer";

const pad = (value: number) => value.toString().padStart(2, "0");

export function CountdownTimer() {
  const time = useCountdownTimer();

  return (
    <div className="flex items-center gap-2">
      {[
        { value: time.hours, label: "Hrs" },
        { value: time.minutes, label: "Min" },
        { value: time.seconds, label: "Sec" },
      ].map((item) => (
        <div key={item.label} className="text-center">
          <div className="grid h-12 w-14 place-items-center rounded-xl bg-foreground text-lg font-semibold tabular-nums text-background">
            {pad(item.value)}
          </div>
          <div className="mt-1 text-[10px] font-medium text-muted-foreground">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
