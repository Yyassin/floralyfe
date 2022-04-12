/**
 * createQuery.ts
 * 
 * Helper to create GraphQL requests.
 * @author Yousef 
 */

import { config } from "lib/config";

/**
 * Creates a generic GraphQL request with the specified query
 * and variables.
 * @param query string, the GraphQL query to request.
 * @param variables any, the query variables.
 * @returns Promise<any>, the query json response.
 */
const createQuery = async (query: string, variables = {} as any) => {
	const options = {
		endpoint: config.GRAPHQL_URL + "/graphql",
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

export { createQuery };