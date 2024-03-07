import { z } from 'zod';

const characterMinLength = 2;
const characterMaxLength = 50;

const productsSchema = z.object({
	name: z
		.string()
		.trim()
		.min(characterMinLength, {
			message: `Product name must be minimum of ${characterMinLength} characters`,
		})
		.max(characterMaxLength, {
			message: `Product name must be maximum of ${characterMaxLength} characters`,
		}),

	stock: z.string().trim().min(1, {
		message: 'Stocks field cannot be empty',
	}),
	price: z.string().trim().min(1, {
		message: 'Price field cannot be empty',
	}),
	cost: z.string().trim().min(1, {
		message: 'Cost field cannot be empty',
	}),
});

export default productsSchema;
