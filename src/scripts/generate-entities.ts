import { exec } from 'child_process';
import { resolve } from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: resolve(__dirname, '../../.env') });

const rootDir = resolve(__dirname, '../../');
const outputDir = './src/shared';

const host = process.env.DB_HOST ?? '127.0.0.1';
const database = process.env.DB_NAME ?? 'test_db';
const username = process.env.DB_USER ?? 'root';
const password = process.env.DB_PASS ?? '';
const dbType = process.env.DB_TYPE ?? 'mysql';

const command = `typeorm-model-generator -h ${host} -d ${database} -u ${username} -x ${password} -e ${dbType} -o ${outputDir} --cf none --cp none  --namingStrategy=./src/scripts/naming-strategy.js `;

process.chdir(rootDir);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`STDERR: ${stderr}`);
    return;
  }
  console.log(`STDOUT:\n${stdout}`);
});
