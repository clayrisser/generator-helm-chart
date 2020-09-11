import _ from 'lodash';
import fs from 'fs-extra';
import modInline from 'mod-inline';
import path from 'path';

export default async function writing(yo) {
  if (yo.context.configItem.secret) {
    const secretPath = path.resolve(
      yo.context.destination,
      'templates/secret.yaml'
    );
    if (fs.existsSync(secretPath)) {
      yo.fs.copy(secretPath, yo.destinationPath('templates/secret.yaml'), {
        process: (content) => processSecret(content, yo.context)
      });
    } else {
      yo.fs.copyTpl(
        yo.templatePath('../../app/templates/templates/secret.yaml'),
        yo.destinationPath('templates/secret.yaml'),
        {
          ...yo.context,
          configSecrets: [yo.context.configItem],
          databases: []
        }
      );
    }
  } else {
    const configMapPath = path.resolve(
      yo.context.destination,
      'templates/configmap.yaml'
    );
    if (fs.existsSync(configMapPath)) {
      yo.fs.copy(
        configMapPath,
        yo.destinationPath('templates/configmap.yaml'),
        {
          process: (content) => processConfigMap(content, yo.context)
        }
      );
    } else {
      yo.fs.copyTpl(
        yo.templatePath('../../app/templates/templates/configmap.yaml'),
        yo.destinationPath('templates/configmap.yaml'),
        {
          ...yo.context,
          configMaps: [yo.context.configItem],
          databases: []
        }
      );
    }
  }
  yo.fs.copy(
    path.resolve(yo.context.destination, 'values.yaml'),
    yo.destinationPath('values.yaml'),
    { process: (content) => processValues(content, yo.context) }
  );
  yo.fs.copy(
    path.resolve(yo.context.destination, 'questions.yaml'),
    yo.destinationPath('questions.yaml'),
    { process: (content) => processQuestions(content, yo.context) }
  );
}

function processConfigMap(content, context) {
  const { configItem } = context;
  const DATA = /\ndata:(\n {2}[^\n]+)+/;
  content = content.toString();
  content = modInline.append(
    content,
    DATA,
    `
  ${_.snakeCase(configItem.key)}: {{ .Values.config.${
      configItem.key
    } | quote }}`
  );
  return content;
}

function processSecret(content, context) {
  const { configItem } = context;
  const DATA = /\ndata:(\n {2}[^\n]+)+/;
  content = content.toString();
  content = modInline.append(
    content,
    DATA,
    `
  ${_.snakeCase(configItem.key)}: {{ .Values.config.${
      configItem.key
    } | b64enc }}`
  );
  return content;
}

function processValues(content, context) {
  const { configItem } = context;
  const CONFIG = /\nconfig:(\n {2}[^\n]+)+/;
  content = content.toString();
  content = modInline.append(
    content,
    CONFIG,
    `
  ${configItem.key}: '${configItem.defaultValue}'`
  );
  return content;
}

function processQuestions(content, context) {
  const { configItem } = context;
  const IMPRECISE_CONFIG = /\nquestions:\n(.|\n)* {4}group: Config([^-#]|\n)*/;
  const PRECISE_CONFIG = /# Config(\n {2}- [^\n]+(\n {4}[^\n]+)+)+/;
  content = content.toString();
  try {
    content = modInline.append(
      content,
      [IMPRECISE_CONFIG, PRECISE_CONFIG],
      `
  - variable: config.${configItem.key}
    default: '${configItem.defaultValue}'
    description: ''
    type: ${configItem.type}
    required: ${configItem.required}
    label: '${configItem.label}'
    group: Config`
    );
  } catch (err) {
    if (err.message !== "Cannot read property 'match' of null") throw err;
    content = modInline.append(
      content,
      /questions:/,
      `

# Config
  - variable: config.${configItem.key}
    default: '${configItem.defaultValue}'
    description: ''
    type: ${configItem.type}
    required: ${configItem.required}
    label: '${configItem.label}'
    group: Config`
    );
  }
  return content;
}
