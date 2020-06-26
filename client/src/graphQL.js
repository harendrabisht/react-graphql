import {isLoggedIn, getAccessToken } from './auth';
import { HttpLink, ApolloClient, ApolloLink, InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';


const apiUrl = 'http://localhost:5000/graphql';
const authLink = new ApolloLink((operation, forward) => {
	if(isLoggedIn) {
		operation.setContext({
			headers: {
				'authorization': `Bearer ${getAccessToken()}`,
			},
		});
	}
	return forward(operation);
})
const cache = new InMemoryCache();
const link = ApolloLink.from([
	authLink,
	new HttpLink({
		uri: apiUrl,
	}),
]) 
export const client = new ApolloClient({
	link,
	cache,
});

const jobQuery = gql`
	query JobQuery($jobId: ID!){
		job(id: $jobId){
		id
		title
		description
		company{
			id
			name
		}
	}
}`;


export const loadJobs = async () => {
	const query = gql`{
		jobs {
		  id
		  title
		  description
		  company {
			id
			name
		  }
		}
	}`;
	const response = await client.query({
		query,
		fetchPolicy: 'no-cache',
	});
	const { data: { jobs } } = response;
	return jobs;
};

export const loadJobDetails = async (id) => {
	const response = await client.query({
		query: jobQuery,
		variables: { jobId: id}
	});
	const { data: {job}} = response;
	return job;
};

export const loadCompanyDetails = async (companyId) => {
	const query = gql`
		query CompanyQuery($id: ID!) {
			company(id: $id){
			id
			name
			description
			jobs{
				id
				title
			}
		}
	}`;
	
	const response = await client.query({ query, variables: {id: companyId}});
	const { data: {company}} = response;
	return company;
};

export const createNewJob = async (inputvalue) => {
	// Mutation
	const mutation = gql`
		mutation CreateJob($inputvalue: InputData) {
			job: createJob(input: $inputvalue) {
			id
			title
			description
			company{
				name
				id
			}
		}
	}`;

	const response = await client.mutate({ 
		mutation,
		variables: { inputvalue },
		update:(cache, { data }) => {
			cache.writeQuery({
				query: jobQuery,
				variables: { jobId: data.job.id },
				data,
			});
		},
	});
	const { data: { job } } = response;
	return job;
};

 //--------------------No more need this function ------------------//
const graphQLFetch = async function({query, variables}) {
	const requestHeader = {
		'content-type': 'application/json'
	};
	if(isLoggedIn) {
		requestHeader['authorization'] = `Bearer ${getAccessToken()}`;
	}

	const response = await fetch(apiUrl, {
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
