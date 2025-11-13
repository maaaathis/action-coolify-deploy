import * as core from '@actions/core';
import axios, { AxiosError } from 'axios';

enum Inputs {
	CoolifyUrl = 'coolify-url',
	CoolifyAppId = 'coolify-app-id',
	CoolifyToken = 'coolify-token',
}

async function deploy(): Promise<void> {
	try {
		const url = core.getInput(Inputs.CoolifyUrl, { required: false });
		const applicationId = core.getInput(Inputs.CoolifyAppId, { required: false });
		const token = core.getInput(Inputs.CoolifyToken, { required: false });
		const branch = process.env.GITHUB_REF_NAME;

		core.debug(`Deploy application ${applicationId} of branch ${branch}`);

		const { data } = await axios({
			method: 'post',
			url: `${url}/api/v1/deploy?uuid=${applicationId}`,
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		core.setOutput('build-id', data.buildId);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError<{ message: string }>;

			return core.setFailed(
				`Error: ${axiosError.response?.status}, message ${JSON.stringify(axiosError.response?.data?.message)}`,
			);
		}

		return core.setFailed('Unknown error occured');
	}
}

void deploy();
