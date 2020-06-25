import React, { Component } from 'react';
import { JobList } from './JobList';
// const { jobs } = require('./fake-data');

export class JobBoard extends Component {
  state = {
    jobs: [],
  }
  async componentDidMount() {

    const resposneData = await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          jobs {
            id
            title
            description
            company {
              id
              name
            }
          }
        }`
      })
    });

    const response = await resposneData.json();
    const { data: { jobs } } = response;
    this.setState({
      jobs,
    });
  }
  render() {
    const { jobs} = this.state;
    return (
      <div>
        <h1 className="title">Job Board</h1>
        <JobList jobs={jobs} />
      </div>
    );
  }
}
