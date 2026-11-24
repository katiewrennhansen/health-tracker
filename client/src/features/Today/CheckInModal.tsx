import { CheckInForm } from "@/features/CheckIns/CheckInForm";
import Modal from "@/ui/Modal";

type CheckInModalProps = {
  onClose: () => void;
};

/** The morning check-in form in a modal; closes once the check-in is saved. */
export function CheckInModal({ onClose }: CheckInModalProps) {
  return (
    <Modal title="Morning check-in" onClose={onClose}>
      <CheckInForm onSaved={onClose} />
    </Modal>
  );
}
