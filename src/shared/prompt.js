export default class Prompt {
  constructor(yo) {
    this.yo = yo;
  }

  async getKeywords({ name }) {
    const keywords = [name];
    for (;;) {
      const { keyword } = await this.yo.prompt([
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

  async getWorkloads() {
    const workloads = [];
    for (;;) {
      let workload = await this.yo.prompt([
        {
          message: 'Workload Name:',
          name: 'name',
          type: 'input'
        }
      ]);
      if (!workload.name.length) break;
      workload = await this.getWorkload(workload);
      workloads.push(workload);
    }
    return workloads;
  }

  async getWorkload(workload) {
    if (!workload) {
      workload = await this.yo.prompt([
        {
          default: 'alpine',
          message: 'Workload Name:',
          name: 'name',
          type: 'input'
        }
      ]);
    }
    workload = {
      ...workload,
      ...(await this.yo.prompt([
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
    workload.volumes = await this.getVolumes();
    return workload;
  }

  async getVolumes() {
    const volumes = [];
    for (;;) {
      let volume = await this.yo.prompt([
        {
          message: 'Volume Name:',
          name: 'name',
          type: 'input'
        }
      ]);
      if (!volume.name.length) break;
      volume = await this.getVolume(volume);
      volumes.push(volume);
    }
    return volumes;
  }

  async getVolume(volume) {
    if (!volume) {
      volume = await this.yo.prompt([
        {
          default: 'data',
          message: 'Volume Name:',
          name: 'name',
          type: 'input'
        }
      ]);
    }
    return {
      ...volume,
      ...(await this.yo.prompt([
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
          default: false,
          message: 'Volume Read Only:',
          name: 'readOnly',
          type: 'confirm'
        }
      ]))
    };
  }

  async getConfig() {
    const config = [];
    for (;;) {
      let configItem = await this.yo.prompt([
        {
          message: 'Config Key:',
          name: 'key',
          type: 'input'
        }
      ]);
      if (!configItem.key.length) break;
      configItem = {
        ...configItem,
        ...(await this.yo.prompt([
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
        ...(await this.yo.prompt([
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
}
