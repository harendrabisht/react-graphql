import {isLoggedIn, getAccessToken } from './auth';
import { HttpLink, ApolloClient, InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';


const apiUrl = 'http://localhost:5000/graphql';

const cache = new InMemoryCache();
const link = new HttpLink({
	uri: apiUrl,
});

export const client = new ApolloClient({
	link,
	cache,
});


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
	});
	const { data: { jobs } } = response;
	return jobs;
};

export const loadJobDetails = async (id) => {
	const query = gql`
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
	const response = await client.query({
		query,
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
