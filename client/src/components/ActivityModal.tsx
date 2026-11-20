import Modal from "@/ui/Modal";
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
    <Modal
      title={activity ? "Edit activity" : "Add activity"}
      onClose={onClose}
    >
      <ActivityForm onSaved={onClose} activity={activity} />
    </Modal>
  );
}
