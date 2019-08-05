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
    (await yo.optionOrPrompt([
      {
        type: 'checkbox',
        name: 'databases',
        message: 'Databases:',
        default: [],
        choices: [
          { name: 'Elasticsearch', value: 'elasticsearch' },
          { name: 'Mongo', value: 'mongo' },
          { name: 'MySQL', value: 'mysql' },
          { name: 'Postgres', value: 'postgres' },
          { name: 'Redis', value: 'redis' }
        ]
      }
    ])).databases,
    database => {
      return {
        elasticsearch: {
          explorer: 'kibana',
          explorerImage: 'kibana:7.3.0',
          name: 'elasticsearch'
        },
        mongo: {
          explorer: 'mongo-express',
          explorerImage: 'mongo-express:0.49.0',
          name: 'mongodb'
        },
        mysql: {
          explorer: 'phpmyadmin',
          explorerImage: 'phpmyadmin/phpmyadmin:4.7',
          name: 'mysql'
        },
        postgres: {
          explorer: 'pgadmin',
          explorerImage: 'dpage/pgadmin4:4.11',
          name: 'postgres'
        },
        redis: {
          explorer: 'phpredisadmin',
          explorerImage: 'erikdubbelboer/phpredisadmin:v1.11.4',
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
