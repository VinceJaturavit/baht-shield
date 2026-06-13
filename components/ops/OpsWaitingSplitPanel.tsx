interface Props {
  waitingOnUs: number;
  waitingOnExternal: number;
}

export function OpsWaitingSplitPanel({ waitingOnUs, waitingOnExternal }: Props) {
  return (
    <p className="text-[11px] leading-relaxed text-ourox-ink/50">
      External waits need chasing, but they are not the same operational failure as work waiting
      on the team. Active split:{" "}
      <span className="text-ourox-ink/70">on us {waitingOnUs}</span>
      {" · "}
      <span className="text-ourox-ink/70">external {waitingOnExternal}</span>
    </p>
  );
}
