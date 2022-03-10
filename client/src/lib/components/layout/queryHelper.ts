import { config } from "lib/config";

const queryHelper = async (query: string, variables = {} as any) => {
	const options = {
		endpoint: URL,
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ query, variables }),
	};

	try {
		const data = await fetch(config.GRAPHQL_URL + "/graphql", options)
			.then((response) => {
				return response.json();
			})
			.catch((error) => {
				console.error("Products not fetched: " + error.message);
			});

		return data;
	} catch (error: any) {
		console.error("Products not fetched: " + error.message);
	}
};

export { queryHelper };