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
          { name: 'Cassandra', value: 'cassandra' },
          { name: 'Elasticsearch', value: 'elasticsearch' },
          { name: 'Mariadb', value: 'mariadb' },
          { name: 'Mongo', value: 'mongo' },
          { name: 'MySQL', value: 'mysql' },
          { name: 'Postgres', value: 'postgres' },
          { name: 'Redis', value: 'redis' }
        ]
      }
    ])).databases,
    database => {
      return {
        cassandra: {
          name: 'cassandra',
          image: 'cassandra:latest'
        },
        elasticsearch: {
          name: 'elasticsearch',
          image: 'elasticsearch:latest'
        },
        mariadb: {
          name: 'mariadb',
          image: 'mariadb:latest'
        },
        mongo: {
          name: 'mongo',
          image: 'mongo:latest'
        },
        mysql: {
          name: 'mysql',
          image: 'mysql:latest'
        },
        postgres: {
          name: 'postgres',
          image: 'postgres:latest'
        },
        redis: {
          name: 'redis',
          image: 'redis:latest'
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
