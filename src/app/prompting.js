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
  const { icon } = await yo.optionOrPrompt([
    {
      message: 'Icon:',
      name: 'icon',
      type: 'input'
    }
  ]);
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
    workload.volumes = volumes;
    workloads.push(workload);
  }
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
