import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { loadJobDetails } from './graphQL';

export class JobDetail extends Component {
  state = {
    job: null,
  }
	constructor(props) {
		super(props);
  }
  
  async componentDidMount() {
    const { jobId } = this.props.match.params;
    const job = await loadJobDetails(jobId);
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
