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
  const workload = await yo.prompt([
    {
      message: 'Workload Name:',
      name: 'name',
      type: 'input'
    },
    {
      default: 'alpine:latest',
      message: 'Workload Image:',
      name: 'image',
      type: 'input'
    },
    {
      default: '3000',
      message: 'Workload Port:',
      name: 'port',
      type: 'input'
    },
    {
      default: true,
      message: 'Workload Public:',
      name: 'public',
      type: 'confirm'
    }
  ]);
  workload.volumes = await getVolumes(yo);

  yo.answers = {
    destination,
    name,
    workload
  };
  yo.context = { ...yo.context, ...yo.answers };
}

async function getVolumes(yo) {
  const volumes = [];
  for (;;) {
    let volume = await yo.prompt([
      {
        message: 'Volume Name:',
        name: 'name',
        type: 'input'
      }
    ]);
    if (!volume.name.length) break;
    volume = {
      ...volume,
      ...(await yo.prompt([
        {
          default: '/data',
          message: 'Volume Mount Path:',
          name: 'mountPath',
          type: 'input'
        },
        {
          message: 'Volume Sub Path:',
          name: 'subPath',
          type: 'input'
        },
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
        },
        {
          default: false,
          message: 'Volume Read Only:',
          name: 'readOnly',
          type: 'confirm'
        }
      ]))
    };
    volumes.push(volume);
  }
  return volumes;
}
