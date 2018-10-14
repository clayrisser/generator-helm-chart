import YoBasePrompts from 'yo-base-prompts';
import _ from 'lodash';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';

export default async function prompting(yo) {
  const yoBasePrompts = new YoBasePrompts(yo);
  if (!_.includes(process.argv, '--destination')) {
    process.argv.push(`--destination=${process.cwd()}`);
  }
  yoBasePrompts.name = 'placeholder';
  const { destination } = await yoBasePrompts.prompt({
    destination: true
  });
  const { name } = yaml.safeLoad(
    fs.readFileSync(path.resolve(destination, 'Chart.yaml'), 'utf8')
  );
  let deployment = await yo.prompt([
    {
      message: 'Deployment Name:',
      name: 'name',
      type: 'input'
    }
  ]);
  deployment = {
    ...deployment,
    ...(await yo.prompt([
      {
        default: 'alpine:latest',
        message: 'Deployment Image:',
        name: 'image',
        type: 'input'
      },
      {
        default: '3000',
        message: 'Deployment Port:',
        name: 'port',
        type: 'input'
      },
      {
        default: true,
        message: 'Deployment Public:',
        name: 'public',
        type: 'confirm'
      }
    ]))
  };
  yo.answers = {
    deployment,
    destination,
    name
  };
  yo.context = { ...yo.context, ...yo.answers };
}
