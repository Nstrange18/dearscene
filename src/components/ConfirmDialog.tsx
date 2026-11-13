import { useEffect, useId, useRef } from 'react';
export function ConfirmDialog({ title, description, confirmLabel, confirm, cancel }: { title: string; description: string; confirmLabel: string; confirm: () => void; cancel: () => void }) {
  const ref = useRef<HTMLDialogElement>(null); const titleId = useId(); const descriptionId = useId();
  useEffect(() => { ref.current?.showModal(); }, []);
  return <dialog ref={ref} className="confirm-dialog" aria-labelledby={titleId} aria-describedby={descriptionId} onCancel={cancel}>
    <h2 id={titleId}>{title}</h2><p id={descriptionId}>{description}</p><div className="confirm-actions"><button autoFocus className="button button--outline" onClick={cancel}>Keep it</button><button className="button button--danger" onClick={confirm}>{confirmLabel}</button></div>
  </dialog>;
}
