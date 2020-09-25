import YoBasePrompts from 'yo-base-prompts';
import _ from 'lodash';
import { Prompt } from '../shared';

export default async function prompting(yo) {
  const yoBasePrompts = new YoBasePrompts(yo);
  const prompt = new Prompt(yo);
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
  const keywords = await prompt.getKeywords({ name });
  const { icon } = await yo.optionOrPrompt([
    {
      message: 'Icon:',
      name: 'icon',
      type: 'input'
    }
  ]);
  const workloads = await prompt.getWorkloads();
  const databases = _.map(
    (
      await yo.optionOrPrompt([
        {
          type: 'checkbox',
          name: 'databases',
          message: 'Databases:',
          default: [],
          choices: [
            { name: 'Elasticsearch', value: 'elasticsearch' },
            { name: 'MongoDB', value: 'mongodb' },
            { name: 'MySQL', value: 'mysql' },
            { name: 'Postgres', value: 'postgres' },
            { name: 'Redis', value: 'redis' }
          ]
        }
      ])
    ).databases,
    database => {
      return {
        elasticsearch: {
          name: 'elasticsearch'
        },
        mongodb: {
          name: 'mongodb'
        },
        mysql: {
          name: 'mysql'
        },
        postgres: {
          name: 'postgres'
        },
        redis: {
          name: 'redis'
        }
      }[database];
    }
  );

  const config = await prompt.getConfig();
  yo.answers = {
    authorEmail,
    authorName,
    authorUrl,
    config,
    databases,
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
