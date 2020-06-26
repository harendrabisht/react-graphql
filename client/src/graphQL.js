import {isLoggedIn, getAccessToken } from './auth';

const graphQLFetch = async function({query, variables}) {
	const requestHeader = {
		'content-type': 'application/json'
	};
	if(isLoggedIn) {
		requestHeader['authorization'] = `Bearer ${getAccessToken()}`;
	}

	const response = await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: requestHeader,
      body: JSON.stringify({
        query,
        variables,
	  }),
	});
	const responseData = await response.json();
	return responseData.data;
}

export default graphQLFetch;
