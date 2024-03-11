import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { zodResolver } from '@hookform/resolvers/zod';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Utils
import toCamelCase from 'src/utils/toCamelCase';
import toCapitalize from 'src/utils/toCapitalize';
import generateDateTime from 'src/utils/generateDateTime';

// Components
import Badge from './Badge';
import Input from './Input';

// Schema
import productsSchema from 'src/formSchemas/productsSchema';

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

function EditProductForm({ preloadedValues, categories, onSubmit, formId }) {
	const navigate = useNavigate();
	const [selectedCategories, setSelectedCategories] = useState(preloadedValues?.categories || []);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({ defaultValues: preloadedValues, resolver: zodResolver(productsSchema) });

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
		const formattedData = {
			...preloadedValues,
			...data,
			cost: Number(data.cost),
			price: Number(data.price),
			stock: Number(data.stock),
			updatedAt: generateDateTime({ isUnix: true }),
			categories: selectedCategories,
		};

		delete formattedData.firebaseId;

		return onSubmit(formattedData);
	};

	return (
		<form
			id={formId}
			className="my-[1em] space-y-[1em]"
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
			<div className="flex justify-end gap-[.6em] py-[1em]">
				<button
					className={twMerge('btn btn-ghost', isSubmitting ? 'btn-disabled' : '')}
					type="button"
					onClick={() => navigate('/')}
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
						'Update'
					)}
				</button>
			</div>
		</form>
	);
}

EditProductForm.propTypes = {
	preloadedValues: PropTypes.object,
	categories: PropTypes.array,
	onSubmit: PropTypes.func,
	formId: PropTypes.string,
};

export default EditProductForm;
