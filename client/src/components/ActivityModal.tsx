import { Modal } from "@heroui/react";
import { ActivityForm } from "@/components/ActivityForm";
import type { Activity } from "@health-tracker/shared";

interface ActivityModalProps {
  onClose: () => void;
  /** The activity to edit; leave out to log a new one. */
  activity?: Activity;
}

/** "Add activity" button that opens the form in a modal, and closes it once the activity is saved. */
export function ActivityModal({ onClose, activity }: ActivityModalProps) {
  return (
    <Modal isOpen={true} onOpenChange={onClose}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                {activity ? "Edit" : "Add"} activity
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <ActivityForm onSaved={onClose} activity={activity} />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
