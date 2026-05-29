import { AlertTriangle } from "lucide-react";

import { useUiStore } from "@/shared/store/ui.store";
import { Button, Modal } from "@/shared/ui";

export function GlobalErrorModal() {
  const globalError = useUiStore((state) => state.globalError);
  const clearErrorModal = useUiStore((state) => state.clearErrorModal);

  return (
    <Modal
      isOpen={Boolean(globalError)}
      onClose={clearErrorModal}
      title={globalError?.title ?? "Unexpected error"}
      description={globalError?.message ?? "Something crashed. Please try again."}
      size="sm"
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4">
          <div className="flex items-center gap-3 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm font-medium">
              {globalError?.code ? `Code: ${globalError.code}` : "Please retry."}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={clearErrorModal}>
            Dismiss
          </Button>
          <Button
            onClick={() => {
              clearErrorModal();
              window.location.reload();
            }}
          >
            Reload App
          </Button>
        </div>
      </div>
    </Modal>
  );
}
