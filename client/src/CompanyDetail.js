import React, { Component } from 'react';
import { loadCompanyDetails } from './graphQL';
import { JobList } from './JobList';

export class CompanyDetail extends Component {
  constructor(props) {
    super(props);
    const {companyId} = this.props.match.params;
    this.state = {company: null};
  }

  async componentDidMount() {
    const {companyId} = this.props.match.params;
    const company = await loadCompanyDetails(companyId);
    this.setState({
      company,
    });
  }

  render() {
    const {company} = this.state;
    if(!company) return null;
    return (
      <div>
        <h1 className="title">{company.name}</h1>
        <div className="box">{company.description}</div>
        <div className="title is-5">Jobs in {company.name}</div>
        <JobList jobs={company.jobs} />
      </div>
    );
  }
}
