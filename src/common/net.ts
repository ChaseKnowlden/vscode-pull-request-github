import { window } from 'vscode';
import { Agent, globalAgent } from 'https';
import { URL } from 'url';
import { httpsOverHttp } from 'tunnel';

export const agent = getAgent();

/**
 * Return an https agent for the given proxy URL, or return the
 * global https agent if the URL was empty or invalid.
 *
 * @param {string} url the proxy URL, (default: `process.env.HTTPS_PROXY`)
 * @returns {https.Agent}
 */
function getAgent(url: string | undefined = process.env.HTTPS_PROXY): Agent {
	if (!url) { return globalAgent; }
	try {
		const { hostname, port, username, password } = new URL(url);
		const auth = username && password && `${username}:${password}`;
		return httpsOverHttp({ proxy: { host: hostname, port, proxyAuth: auth } });
	} catch (e) {
		window.showErrorMessage(`HTTPS_PROXY environment variable ignored: ${e.message}`);
		return globalAgent;
	}
}
