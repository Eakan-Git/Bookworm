interface CloseOnClickOutSideModalProps {
    modalId: string;
    children: React.ReactNode;
}

export default function CloseOnClickOutSideModal({ modalId, children }: CloseOnClickOutSideModalProps) {
    return (
        <dialog id={modalId} className="modal">
            <div className="modal-box">
                {children}
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>Close</button>
            </form>
        </dialog>
    );
}