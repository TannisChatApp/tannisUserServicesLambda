import * as serverless from 'serverless-http';
import { App } from './app/app';

const handler = serverless((App.getAppInstance()).getInternalExpressInstance());
export { handler };