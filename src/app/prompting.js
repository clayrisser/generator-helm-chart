import YoBasePrompts from 'yo-base-prompts';

export default async function prompting(yo) {
  const yoBasePrompts = new YoBasePrompts(yo);
  const {
    authorEmail,
    authorName,
    authorUrl,
    description,
    destination,
    githubUsername,
    homepage,
    license,
    name,
    repository,
    version
  } = await yoBasePrompts.prompt({
    authorEmail: true,
    authorName: true,
    authorUrl: true,
    description: true,
    destination: true,
    githubUsername: true,
    homepage: true,
    license: true,
    name: true,
    repository: true,
    version: true
  });
  const keywords = await getKeywords(yo, { name });
  const { icon } = await yo.optionOrPrompt([
    {
      message: 'Icon:',
      name: 'icon',
      type: 'input'
    }
  ]);
  const workloads = await getWorkloads(yo);
  const config = await getConfig(yo);
  yo.answers = {
    authorEmail,
    authorName,
    authorUrl,
    config,
    description,
    destination,
    githubUsername,
    homepage,
    icon,
    keywords,
    license,
    name,
    repository,
    version,
    workloads
  };
  yo.context = { ...yo.context, ...yo.answers };
}

async function getKeywords(yo, { name }) {
  const keywords = [name];
  for (;;) {
    const { keyword } = await yo.prompt([
      {
        message: 'Keyword:',
        name: 'keyword',
        type: 'input'
      }
    ]);
    if (keyword === '') break;
    keywords.push(keyword);
  }
  return keywords;
}

async function getWorkloads(yo) {
  const workloads = [];
  for (;;) {
    let workload = await yo.prompt([
      {
        message: 'Workload Name:',
        name: 'name',
        type: 'input'
      }
    ]);
    if (!workload.name.length) break;
    workload = {
      ...workload,
      ...(await yo.prompt([
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
      ]))
    };
    workload.volumes = await getVolumes(yo);
    workloads.push(workload);
  }
  return workloads;
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

async function getConfig(yo) {
  const config = [];
  for (;;) {
    let configItem = await yo.prompt([
      {
        message: 'Config Key:',
        name: 'key',
        type: 'input'
      }
    ]);
    if (!configItem.key.length) break;
    configItem = {
      ...configItem,
      ...(await yo.prompt([
        {
          default: false,
          message: 'Config Secret:',
          name: 'secret',
          type: 'confirm'
        }
      ]))
    };
    configItem = {
      ...configItem,
      ...(await yo.prompt([
        {
          default: configItem.secret ? 'password' : 'string',
          message: 'Config Type:',
          name: 'type',
          type: 'list',
          choices: [
            {
              name: 'string',
              value: 'string'
            },
            {
              name: 'boolean',
              value: 'boolean'
            },
            {
              name: 'int',
              value: 'int'
            },
            {
              name: 'enum',
              value: 'enum'
            },
            {
              name: 'password',
              value: 'password'
            },
            {
              name: 'storageclass',
              value: 'storageclass'
            },
            {
              name: 'hostname',
              value: 'hostname'
            }
          ]
        },
        {
          message: 'Config Default Value:',
          name: 'defaultValue',
          type: 'input'
        },
        {
          default: configItem.key,
          message: 'Config Description:',
          name: 'description',
          type: 'input'
        },
        {
          default: false,
          message: 'Config Required:',
          name: 'required',
          type: 'confirm'
        }
      ]))
    };
    config.push(configItem);
  }
  return config;
}
