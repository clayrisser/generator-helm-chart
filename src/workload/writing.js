import modInline from 'mod-inline';
import path from 'path';

export default async function writing(yo) {
  yo.fs.copy(
    path.resolve(yo.context.destination, 'questions.yaml'),
    yo.destinationPath('questions.yaml'),
    { process: content => processQuestions(content, yo.context) }
  );
  yo.fs.copy(
    path.resolve(yo.context.destination, 'values.yaml'),
    yo.destinationPath('values.yaml'),
    { process: content => processValues(content, yo.context) }
  );
  if (yo.context.workload.public) {
    yo.fs.copyTpl(
      yo.templatePath('templates/deployments/public.yaml'),
      yo.destinationPath(
        `templates/deployments/${yo.context.workload.name}.yaml`
      ),
      yo.context
    );
    yo.fs.copyTpl(
      yo.templatePath('templates/services/public.yaml'),
      yo.destinationPath(`templates/services/${yo.context.workload.name}.yaml`),
      yo.context
    );
    yo.fs.copyTpl(
      yo.templatePath('templates/ingress.yaml'),
      yo.destinationPath(
        `templates/ingresses/${yo.context.workload.name}.yaml`
      ),
      yo.context
    );
  } else {
    yo.fs.copyTpl(
      yo.templatePath('templates/deployments/private.yaml'),
      yo.destinationPath(
        `templates/deployments/${yo.context.workload.name}.yaml`
      ),
      yo.context
    );
    yo.fs.copyTpl(
      yo.templatePath('templates/services/private.yaml'),
      yo.destinationPath(`templates/services/${yo.context.workload.name}.yaml`),
      yo.context
    );
  }
}

function processQuestions(content, context) {
  content = content.toString();
  if (context.workload.public) {
    const INGRESS_ENABLED = / {2}- variable: ingress\.enabled((\n {4}[^\n]+)+)?/;
    const SERVICE_TYPE = / {2}- variable: service\.type((\n {4}[^\n]+)+)?/;
    const SUBQUESTIONS = / {4}subquestions:((\n {6}[^\n]+)+)?/;
    content = modInline.append(
      content,
      [INGRESS_ENABLED, SUBQUESTIONS],
      `\n      - variable: ingress.hosts.${
        context.workload.name
      }[0].name\n        default: xip.io\n        description: 'hostname to your ${
        context.workload.name
      } installation'\n        type: hostname\n        required: true\n        label: '${
        context.workload.name
      } hostname'\n      - variable: ingress.hosts.${
        context.workload.name
      }[0].path\n        default: /\n        description: 'pathname to your ${
        context.workload.name
      } installation'\n        type: string\n        required: true\n        label: '${
        context.workload.name
      } path'`
    );
    content = modInline.append(
      content,
      [SERVICE_TYPE, SUBQUESTIONS],
      `\n      - variable: service.nodePorts.${
        context.workload.name
      }.http\n        default: ''\n        description: 'NodePort ${
        context.workload.name
      } http port (to set explicitly, choose port between 30000-32767)'\n        type: int\n        min: 30000\n        max: 32767\n        show_if: ingress.enabled=false&&service.type=NodePort\n        label: '${
        context.workload.name
      } http port'`
    );
  }
  return content;
}

function processValues(content, context) {
  content = content.toString();
  const IMAGES = /images:((\n {2}[^\n]+)+)?/;
  const { image } = context.workload;
  content = modInline.append(
    content,
    IMAGES,
    `\n  ${context.workload.name}:\n    repository: ${image.substr(
      0,
      image.indexOf(':')
    )}\n    tag: ${image.substr(
      image.indexOf(':') + 1
    )}\n    pullPolicy: IfNotPresent`
  );
  if (context.workload.public) {
    const HOSTS = / {2}hosts:((\n {4}[^\n]+)+)?/;
    const INGRESS = /ingress:((\n {2}[^\n]+)+)/;
    const NODE_PORTS = / {2}nodePorts:((\n {4}[^\n]+)+)?/;
    const SERVICE = /service:((\n {2}[^\n]+)+)/;
    content = modInline.append(
      content,
      [SERVICE, NODE_PORTS],
      `\n    ${context.workload.name}:\n      http: ''`
    );
    content = modInline.append(
      content,
      [INGRESS, HOSTS],
      `\n    ${context.workload.name}:\n      - name: ''\n        path: /`
    );
  }
  return content;
}
