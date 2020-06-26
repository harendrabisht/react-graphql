const db = require('./db');

const Query = {
	job: (root, args) => db.jobs.get(args.id),
	jobs: () => db.jobs.list(),
	company:(root, args) => db.companies.get(args.id),
};

const Company = {
	jobs: (company) => db.jobs.list()
	.filter(job => job.companyId === company.id),
}

const Mutation = {
	createJob: (root, { input }, context) => {
		const { companyId } = context.user;
		const id = db.jobs.create({...input, companyId});
		return db.jobs.get(id);
	},
}

const Job = {
	company: (job) => db.companies.get(job.companyId),
}

module.exports = {
	Query,
	Company,
	Mutation,
	Job,
};