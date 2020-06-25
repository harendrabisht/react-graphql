import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { jobs } from './fake-data';

export class JobDetail extends Component {
  state = {
    job: null,
  }
	constructor(props) {
		super(props);
  }
  
  async componentDidMount() {
    const { jobId } = this.props.match.params;
    const response = await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query: `query JobQuery($jobId: ID!){
          job(id: $jobId){
            id
            title
            description
            company{
              id
              name
            }
          }
        }`,
        variables: {jobId}
      }),
    });

    const responseData = await response.json();
    const { job } = responseData.data;
    this.setState({
      job,
    });
  }
	render() {
    const { job } = this.state;
    if(!job) return null;
    
		return (
			<div>
				<h1 className="title">{job.title}</h1>
				<h2 className="subtitle">
					<Link to={`/companies/${job.company.id}`}>
						{job.company.name}
					</Link>
				</h2>
				<div className="box">{job.description}</div>
			</div>
		);
	}
}
