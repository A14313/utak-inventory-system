import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
function Modal({
	isOpen,
	closeModal,
	modalTitle,
	submitText,
	formToSubmit,
	handleSubmit,
	isSubmitting,
	submitButtonStyles,
	includeModalActions = true,
	children,
}) {
	const dialogRef = useRef(null);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') closeModal && closeModal();
		};

		if (isOpen) {
			dialogRef.current.showModal();
			document.addEventListener('keydown', handleKeyDown);
		} else {
			dialogRef.current.close();
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, closeModal]);

	const handleClose = () => {
		closeModal && closeModal();
	};
	return (
		<dialog ref={dialogRef} className="modal modal-bottom lrg:modal-middle">
			<div className="modal-box p-0">
				<div className="p-[1.5em] bg-base-100 sticky top-0">
					<h3 className="font-bold text-2xl med:text-3xl">
						{modalTitle || 'Add title to the modal'}
					</h3>
				</div>

				<div className="px-[1.5em] pt-[1em]">{children}</div>

				{includeModalActions && (
					<div className="modal-action px-[1.5em] pb-[1.5em] lrg:pt-[1.5em]">
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button className="btn btn-ghost" onClick={handleClose}>
								Close
							</button>
						</form>
						<button
							className={twMerge(
								'btn btn-primary text-slate-50 dark:text-slate-800',
								submitButtonStyles,
							)}
							form={formToSubmit || null}
							type="submit"
							disabled={isSubmitting}
							onClick={handleSubmit}>
							{isSubmitting ? (
								<span className="loading loading-spinner loading-xs"></span>
							) : (
								submitText
							)}
						</button>
					</div>
				)}
			</div>
		</dialog>
	);
}

Modal.propTypes = {
	isOpen: PropTypes.bool,
	closeModal: PropTypes.func,
	modalTitle: PropTypes.string,
	submitText: PropTypes.string,
	submitButtonStyles: PropTypes.string,
	formToSubmit: PropTypes.string,
	handleSubmit: PropTypes.func,
	isSubmitting: PropTypes.bool,
	includeModalActions: PropTypes.bool,
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.elementType]),
};

export default Modal;
