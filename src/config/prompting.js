import YoBasePrompts from 'yo-base-prompts';
import _ from 'lodash';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';
import { Prompt } from '../shared';

export default async function prompting(yo) {
  const yoBasePrompts = new YoBasePrompts(yo);
  const prompt = new Prompt(yo);
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
  const configItem = await prompt.getConfigItem();
  yo.answers = {
    configItem,
    destination,
    name
  };
  yo.context = { ...yo.context, ...yo.answers };
}
