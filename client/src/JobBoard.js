import React, { Component } from 'react';
import { JobList } from './JobList';
import { loadJobs } from './graphQL';
// const { jobs } = require('./fake-data');

export class JobBoard extends Component {
  state = {
    jobs: [],
  }
  async componentDidMount() {

    const jobs = await loadJobs();
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
