import express from 'express';
import indexRouter from './modules/core/routes/index.router';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
const app = express();

app.use(
    logger('dev', {
        skip: (rq) => rq.url === '/health',
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use('/', indexRouter);

app.use((req, res) => {
    return res.status(404).send({ message: `Route '${req.url}' Not found.` });

});

export default app;
