import YoBasePrompts from 'yo-base-prompts';

export default async function prompting(yo) {
  const yoBasePrompts = new YoBasePrompts(yo);
  yoBasePrompts.name = name;
  const { destination, name } = await yoBasePrompts.prompt({
    destination: true,
    name: true
  });
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
