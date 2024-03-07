function toCamelCase({ phrase }) {
	if (phrase) {
		// Split the phrase by spaces, underscores, or dash
		const words = phrase?.split(/\s+|_|-/);

		// Capitalize the first letter of each phrase except the first one
		const camelCase =
			words[0].toLowerCase() +
			words
				.slice(1)
				.map((el) => el.charAt(0).toUpperCase() + el.slice(1))
				.join('');

		return camelCase;
	}
	return;
}

export default toCamelCase;
