import createError, { HttpError } from "http-errors";
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import express, { Express, NextFunction, Request, Response } from 'express';
import indexRouter from '../routes/index'

export class App {
    private static single_reference: (null|App) = null;
    private readonly exp_app: Express;
    private constructor() {
        this.exp_app = express();
        this.exp_app.set('views', path.join(path.resolve(__dirname, '..'), 'views'));
        this.exp_app.set('view engine', 'pug');
        this.exp_app.use(morgan('dev'));
        this.exp_app.use(express.json());
        this.exp_app.use(express.urlencoded({ extended: true }));
        this.exp_app.use(cookieParser());
        this.exp_app.use(express.static(path.join(path.resolve(__dirname, '..'), 'public')));
        this.exp_app.use('/tannisUserServices', indexRouter);
        this.exp_app.use((req: Request, res: Response, next: NextFunction) => {
            next(createError(404));
        });
        this.exp_app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
            res.locals.message = err.message;
            res.locals.error = err;
            res.status(err.status || 500);
            res.render('error');
        });
    }
    public getInternalExpressInstance(): Express { return (this.exp_app); }
    public static getAppInstance(): App { 
        if (App.single_reference === null) { App.single_reference = new App(); }
        return (App.single_reference);
    }
}
