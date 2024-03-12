import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { zodResolver } from '@hookform/resolvers/zod';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';

// Utils
import toCamelCase from 'src/utils/toCamelCase';
import toCapitalize from 'src/utils/toCapitalize';
import { SIZES } from 'src/utils/constants';

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
	const [selectedSize, setSelectedSize] = useState('Not applicable');
	// Hook form
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		watch,
	} = useForm({
		resolver: zodResolver(productsSchema),
	});

	useEffect(() => {
		const subscription = watch((data) => {
			const { size } = data;
			setSelectedSize(size);
		});

		return () => subscription.unsubscribe();
	}, [watch]);

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
		console.log('formattedData', formattedData);
		return onSubmit(formattedData, resetForm);
	};

	const resetForm = () => {
		reset();
		setSelectedCategories([]);
	};
	console.log(selectedSize);

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
				<h3 className="text-lg mb-[1em] font-medium">Size</h3>
				<div className="flex flex-wrap gap-[.5em]">
					{SIZES.map((el, index) => {
						const id = uuid();
						return (
							<div key={index} className="form-control">
								<input
									{...register('size')}
									type="radio"
									id={id}
									value={el.DISPLAY_NAME}
									onChange={(e) => setSelectedSize(e.target.value)}
									// name="size"
									className="radio checked:bg-accent [&+label]:checked:bg-accent [&+label]:checked:text-slate-50 dark:[&+label]:checked:text-slate-800 [&+label]:focus-visible:border-info [&+label]:focus-visible:border-dashed [&+label]:focus-visible:border-4"
									// checked
									checked={el.DISPLAY_NAME === 'Not applicable'}
								/>
								{/* text-slate-50 dark:text-slate-800 */}
								<label
									className="label cursor-pointer text-sm sm2:text-base text-center border border-solid dark:border-slate-800 rounded-full px-[.8em] py-[.2em] hover:bg-gray-500 dark:hover:bg-gray-300 hover:text-slate-50 dark:hover:text-slate-800 transition-colors duration-500"
									htmlFor={id}>
									<span className="label-text">{el.DISPLAY_NAME}</span>
								</label>
							</div>
						);
					})}
				</div>
			</div>
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
