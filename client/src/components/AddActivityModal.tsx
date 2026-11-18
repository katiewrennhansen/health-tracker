import { Modal } from "@heroui/react";
import { AddActivityForm } from "@/components/AddActivityForm";
import type { Activity } from "@health-tracker/shared";

interface AddActivityModalProps {
  onClose: () => void;
  activity: Activity | null;
}

/** "Add activity" button that opens the form in a modal, and closes it once the activity is saved. */
export function AddActivityModal({ onClose, activity }: AddActivityModalProps) {
  return (
    <Modal isOpen={true} onOpenChange={onClose}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Add activity</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <AddActivityForm onSaved={onClose} activity={activity} />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
