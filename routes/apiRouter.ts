import { Router } from 'express';
import { scanUsersTable, queryUsersTable, insertRecordInUsersTable } from '../services/apiService';


// User-route
const underlyingRouter = Router();
underlyingRouter.post('/scan', scanUsersTable);
underlyingRouter.post('/query', queryUsersTable);
underlyingRouter.put('/put', insertRecordInUsersTable);


const baseApiRouter = Router();
baseApiRouter.use('/api', underlyingRouter);
export default baseApiRouter;
