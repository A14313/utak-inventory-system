import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
function Modal({
	isOpen,
	closeModal,
	modalTitle,
	submitText,
	formToSubmit,
	handleSubmitOnClick,
	isSubmitting,
	submitButtonStyles,
	children,
}) {
	const dialogRef = useRef(null);

	useEffect(() => {
		if (isOpen) {
			dialogRef.current.showModal();
		} else {
			dialogRef.current.close();
		}
	}, [isOpen]);

	const handleClose = () => {
		closeModal && closeModal();
	};
	return (
		<dialog ref={dialogRef} className="modal modal-bottom lrg:modal-middle">
			<div className="modal-box">
				<h3 className="font-bold text-lg">{modalTitle || 'Add title to the modal'}</h3>

				{children}

				<div className="modal-action">
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="btn btn-ghost" onClick={handleClose}>
							Close
						</button>
					</form>
					<button
						className={twMerge('btn btn-primary text-slate-50', submitButtonStyles)}
						form={formToSubmit && formToSubmit}
						type="submit"
						disabled={isSubmitting}
						onClick={handleSubmitOnClick}>
						{isSubmitting ? (
							<span className="loading loading-spinner loading-xs"></span>
						) : (
							submitText
						)}
					</button>
				</div>
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
	handleSubmitOnClick: PropTypes.func,
	isSubmitting: PropTypes.bool,
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.elementType]),
};

export default Modal;
