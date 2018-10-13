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
      message: 'Icon',
      name: 'icon',
      type: 'input'
    }
  ]);
  const deployments = [];
  for (;;) {
    let deployment = await yo.prompt([
      {
        default: name,
        message: 'Deployment Name:',
        name: 'name',
        type: 'input'
      }
    ]);
    if (!deployment.name.length) break;
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
    deployments.push(deployment);
  }
  const config = [];
  for (;;) {
    let configItem = await yo.prompt([
      {
        default: name,
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
          default: true,
          message: 'Config Default Value:',
          name: 'defaultValue',
          type: 'input'
        },
        {
          default: false,
          message: 'Config Secret:',
          name: 'secret',
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
    deployments,
    description,
    destination,
    githubUsername,
    homepage,
    icon,
    keywords,
    license,
    name,
    repository,
    version
  };
  yo.context = { ...yo.context, ...yo.answers };
}
