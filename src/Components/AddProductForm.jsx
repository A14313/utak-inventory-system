import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { zodResolver } from '@hookform/resolvers/zod';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';

// Utils
import toCamelCase from 'src/utils/toCamelCase';
import toCapitalize from 'src/utils/toCapitalize';

// Components
import Badge from './Badge';
import Input from './Input';

// Schema
import productsSchema from 'src/formSchemas/productsSchema';
import { useEffect } from 'react';

const formInputs = [
	{
		id: uuid(),
		name: 'Name',
		placeholder: 'Product name',
		type: 'text',
	},
	{
		id: uuid(),
		name: 'Stock',
		placeholder: 'How many in stocks?',
		type: 'number',
		step: 'any',
	},
	{
		id: uuid(),
		name: 'Price',
		placeholder: 'How much per piece',
		type: 'number',
		step: 'any',
	},
	{
		id: uuid(),
		name: 'Cost',
		placeholder: 'How much is the cost',
		type: 'number',
		step: 'any',
	},
];
function AddProductForm({ categories, onSubmit, formId, handleCancel }) {
	const [selectedCategories, setSelectedCategories] = useState([]);
	// Hook form
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm({
		resolver: zodResolver(productsSchema),
	});

	// Functions
	const handleCategoryChange = ({ category }) => {
		const isChecked = selectedCategories.includes(category);
		if (isChecked) {
			setSelectedCategories((prevState) => prevState.filter((item) => item !== category));
		} else {
			setSelectedCategories((prevState) => [...prevState, category]);
		}
	};

	const onSubmitHandler = (data) => {
		const formattedData = { ...data, categories: selectedCategories };
		return onSubmit(formattedData, resetForm);
	};

	const resetForm = () => {
		reset();
		setSelectedCategories([]);
	};

	return (
		<form
			id={formId}
			className="mb-[1em] space-y-[1em]"
			onSubmit={handleSubmit(onSubmitHandler)}>
			{formInputs.map((el) => {
				return (
					<React.Fragment key={el.id}>
						<Input
							{...register(toCamelCase({ phrase: el.name }))}
							label={el.name}
							type={el.type}
							placeholder={el.placeholder}
							step={el.step || null}
						/>

						{errors?.[toCamelCase({ phrase: el.name })] && (
							<p className="text-error">
								{errors[toCamelCase({ phrase: el.name })]?.message}
							</p>
						)}
					</React.Fragment>
				);
			})}
			<div className="py-[1em]">
				<h3 className="text-lg mb-[1em] font-medium">Categories</h3>
				<div className="flex flex-wrap gap-[.5em]">
					{categories.map((el) => {
						return (
							<div
								key={toCamelCase({ phrase: el.DISPLAY_NAME })}
								className="form-control">
								<Badge
									label={el.DISPLAY_NAME}
									isActive={selectedCategories.includes(
										toCapitalize({ phrase: el.DISPLAY_NAME }),
									)}
									onChange={() =>
										handleCategoryChange({
											category: toCapitalize({ phrase: el.DISPLAY_NAME }),
										})
									}
								/>
							</div>
						);
					})}
				</div>
			</div>
			<div className="flex justify-end gap-[.6em]">
				<button
					className={twMerge('btn btn-ghost', isSubmitting ? 'btn-disabled' : '')}
					type="button"
					onClick={() => {
						handleCancel();
						reset();
						setSelectedCategories([]);
					}}
					disabled={isSubmitting}>
					Cancel
				</button>

				<button
					className={twMerge(
						'btn btn-primary text-slate-50 dark:text-slate-800',
						isSubmitting ? 'btn-disabled' : '',
					)}
					disabled={isSubmitting}>
					{isSubmitting ? (
						<span className="loading loading-spinner loading-sm"></span>
					) : (
						'Add product'
					)}
				</button>
			</div>
		</form>
	);
}
AddProductForm.propTypes = {
	preloadedValues: PropTypes.object,
	categories: PropTypes.array,
	onSubmit: PropTypes.func,
	formId: PropTypes.string,
	handleCancel: PropTypes.func,
};

export default AddProductForm;
