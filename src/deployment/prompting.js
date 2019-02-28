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
        default: true,
        message: 'Deployment Persistence:',
        name: 'persistence',
        type: 'confirm'
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
  const volumes = [];
  for (;;) {
    const volume = await yo.prompt([
      {
        default: 'persistentVolumeClaim',
        message: 'Volume Type:',
        name: 'type',
        type: 'list',
        choices: [
          {
            name: 'persistentVolumeClaim',
            value: 'persistentVolumeClaim'
          },
          {
            name: 'configMap',
            value: 'configMap'
          }
        ]
      }
    ]);
    volumes.push(volume);
  }
  deployment.volumes = volumes;
  yo.answers = {
    deployment,
    destination,
    name
  };
  yo.context = { ...yo.context, ...yo.answers };
}
