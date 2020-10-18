import { Request, Response } from 'express';

export interface RequestResponseObject {
    res: Response;
    req: Request;
}

export const contextFunction = (reqResObj: RequestResponseObject) => reqResObj;