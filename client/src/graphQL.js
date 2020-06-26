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

// Created Job Fragments
const jobFragmants = gql`
	fragment jobDetail on Job {
		id
		title
		description
		company {
			name
			id
		}
	}
`;

const creteJobMutation = gql`
	mutation CreateJob($inputvalue: InputData) {
		job: createJob(input: $inputvalue) {
			...jobDetail
		},
	}
	${jobFragmants}
`;

const jobQuery = gql`
	query JobQuery($jobId: ID!){
		job(id: $jobId){
			...jobDetail,
		},
	}
	${jobFragmants}
`;

const jobsQuery = gql`
	query jobsQuery {
		jobs {
			...jobDetail
		},
	}
	${jobFragmants}
`;

const companyQuery = gql`
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
	}
`;


export const loadJobs = async () => {

	const response = await client.query({
		query: jobsQuery,
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
	const response = await client.query({ query: companyQuery, variables: {id: companyId}});
	const { data: {company}} = response;
	return company;
};

export const createNewJob = async (inputvalue) => {
	const response = await client.mutate({ 
		mutation: creteJobMutation,
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

