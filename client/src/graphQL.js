const graphQLFetch = async function({query, variables}) {
	const response = await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables,
	  }),
	});
	const responseData = await response.json();
	return responseData.data;
}

export default graphQLFetch;
