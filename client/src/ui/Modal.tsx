import { Modal as HeroModal } from "@heroui/react";

type ModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export default function Modal({ onClose, title, children }: ModalProps) {
  return (
    <HeroModal isOpen={true} onOpenChange={onClose}>
      <HeroModal.Backdrop>
        <HeroModal.Container>
          <HeroModal.Dialog className="rounded-sm">
            <HeroModal.CloseTrigger />
            <HeroModal.Header>
              <HeroModal.Heading>{title}</HeroModal.Heading>
            </HeroModal.Header>
            <HeroModal.Body>{children}</HeroModal.Body>
          </HeroModal.Dialog>
        </HeroModal.Container>
      </HeroModal.Backdrop>
    </HeroModal>
  );
}
