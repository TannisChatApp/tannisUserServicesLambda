import { Request, Response, NextFunction } from 'express';
import { StdQueryObj } from '../interfaces/requestBodyData';
import { DB } from '../database/db';
import { dynamoDbTannisUserEntry } from '../interfaces/databaseData';
import { User } from '../models/userModel'

function prepQueryObj (reqBody: any): StdQueryObj {
    return({
        col_patt: ((reqBody.col_patt !== undefined) ? reqBody.col_patt : ""),
        cond: ((reqBody.cond !== undefined) ? reqBody.cond : ""),
        cond_attrs_obj: ((reqBody.cond_attrs_obj !== undefined) ? reqBody.cond_attrs_obj : "")
    });
}

function responseHandler (res: Response, stat: number, rslt: any, err: any) {
    let respBody: object = {};
    respBody['status'] = stat;
    respBody['result'] = rslt;
    respBody['error'] = err;
    res.status(stat);
    res.append('Content-Type', "application/json");
    res.end(JSON.stringify(respBody, null, 2), "utf-8", () => console.log("Request Closed"));
}

function scanAndQueryPromiseHandler (dbPromise: Promise<dynamoDbTannisUserEntry[]|Error>, res: Response) {
    let respBody: object = {};
    dbPromise.then((data: (dynamoDbTannisUserEntry[]|Error)) => {
        if (data instanceof Error) { responseHandler(res, 500, null, data); }
        else { responseHandler(res, 200, data, null); }
    });
}

export function queryUsersTable (req: Request, res: Response) {
    let queryObj: StdQueryObj = prepQueryObj(req.body);
    scanAndQueryPromiseHandler(DB.getDBInstance().runQuery(
        queryObj,
        (req.body.idx_no !== undefined ? Number(req.body.idx_no) : undefined)
    ), res);
}

export function scanUsersTable (req: Request, res: Response) {
    let queryObj: StdQueryObj = prepQueryObj(req.body);
    scanAndQueryPromiseHandler(DB.getDBInstance().runScan(
        queryObj,
        (req.body.idx_no !== undefined ? Number(req.body.idx_no) : undefined)
    ), res);
}

export function insertRecordInUsersTable (req: Request, res: Response) {
    if ((req.body.uid === undefined) || ((/^[A-Z,a-z]{2}[0-9]{1,5}$/g).test(req.body.uid))) {
        responseHandler(res, 500, null, "Required parameter uid is missing or is invalid in request body!!");
        return;
    } else if ((req.body.firstName === undefined) || ((/^[A-Z,a-z]{1,15}$/g).test(req.body.firstName))) {
        responseHandler(res, 500, null, "Required parameter firstName is missing or is invalid in request body!!");
        return;
    } else if ((req.body.lastName === undefined) || ((/^[A-Z,a-z]{1,15}$/g).test(req.body.lastName))) {
        responseHandler(res, 500, null, "Required parameter lastName is missing or is invalid in request body!!");
        return;
    } else if ((req.body.email === undefined) || ((/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g).test(req.body.email))) {
        responseHandler(res, 500, null, "Required parameter email is missing or is invalid in request body!!");
        return;
    } else if ((req.body.phoneNumber === undefined) || ((/^\+[1-9]{1}[0-9]{3,14}$/g).test(req.body.phoneNumber))) {
        responseHandler(res, 500, null, "Required parameter phoneNumber is missing or is invalid in request body!!");
        return;
    } else if ((req.body.passwordHash === undefined) || ((/\b[A-Fa-f0-9]{64}\b/g).test(req.body.passwordHash))) {
        responseHandler(res, 500, null, "Required parameter passwordHash is missing or is invalid in request body!!");
        return;
    } else {
        // Need to take sl no from auto generator map stored in Redis Cache
        let user: User = new User ("1", req.body.uid, req.body.firstName, req.body.lastName, req.body.email, req.body.phoneNumber, req.body.passwordHash, (new Date ()).toString());
        DB.getDBInstance().runPutItem(user)
        .then((data: any) => {
            if (data instanceof Error) { responseHandler(res, 500, null, data); }
            else { responseHandler(res, 200, data, null); }
        });
    }
}