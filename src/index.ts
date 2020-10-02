import express, { Express, Request, Response } from 'express';
import { config as dotenvConfig } from 'dotenv';
import chalk from 'chalk';

dotenvConfig();

const app: Express = express();

app.get('/rest', (_req: Request, res: Response) => {
    res.json({
        data: 'you hit a rest endpoint',
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    const localURL = `http://localhost:${PORT}`;
    console.log(`Server is ready at ${chalk.blueBright(localURL)}`);
});