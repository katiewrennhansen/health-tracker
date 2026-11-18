import { Button, Modal } from "@heroui/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { AddActivityForm } from "@/components/AddActivityForm";

/** "Add activity" button that opens the form in a modal, and closes it once the activity is saved. */
export function AddActivityModal() {
  const [isOpen, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
  };

  return (
    // The Button inside Modal opens it (Modal wraps React Aria's DialogTrigger).
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <Button className="self-start">
        <PlusIcon /> Add activity
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Add activity</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <AddActivityForm onSaved={close} />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
