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
    const deployment = await yo.prompt([
      {
        default: name,
        message: 'Keyword:',
        name: 'name',
        type: 'input'
      }
    ]);
    if (deployment.name === '') break;
    deployment = {
      ...deployment,
      ...(await yo.prompt([
        {
          default: true,
          message: 'Public:',
          name: 'public',
          type: 'confirm'
        },
        {
          default: '3000',
          message: 'Port:',
          name: 'port',
          type: 'input'
        },
        {
          default: 'alpine:latest',
          message: 'Image:',
          name: 'image',
          type: 'input'
        }
      ]))
    };
    deployments.push(deployment);
  }
  yo.answers = {
    authorEmail,
    authorName,
    authorUrl,
    bin,
    deployments,
    description,
    destination,
    githubUsername,
    homepage,
    icon,
    install,
    keywords,
    license,
    lock,
    name,
    repository,
    version
  };
  yo.context = { ...yo.context, ...yo.answers };
}
