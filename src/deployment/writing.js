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
  if (yo.context.deployment.public) {
    yo.fs.copy(
      path.resolve(yo.context.destination, 'templates/certificate.yaml'),
      yo.destinationPath('templates/certificate.yaml'),
      { process: content => processCertificate(content, yo.context) }
    );
    yo.fs.copyTpl(
      yo.templatePath('templates/deployments/public.yaml'),
      yo.destinationPath(
        `templates/deployments/${yo.context.deployment.name}.yaml`
      ),
      yo.context
    );
    yo.fs.copyTpl(
      yo.templatePath('templates/services/public.yaml'),
      yo.destinationPath(
        `templates/services/${yo.context.deployment.name}.yaml`
      ),
      yo.context
    );
    yo.fs.copyTpl(
      yo.templatePath('templates/ingress.yaml'),
      yo.destinationPath(
        `templates/ingresses/${yo.context.deployment.name}.yaml`
      ),
      yo.context
    );
  } else {
    yo.fs.copyTpl(
      yo.templatePath('templates/deployments/private.yaml'),
      yo.destinationPath(
        `templates/deployments/${yo.context.deployment.name}.yaml`
      ),
      yo.context
    );
    yo.fs.copyTpl(
      yo.templatePath('templates/services/private.yaml'),
      yo.destinationPath(
        `templates/services/${yo.context.deployment.name}.yaml`
      ),
      yo.context
    );
  }
}

function processCertificate(content, context) {
  content = content.toString();
  const DOMAINS = / {6}domains:(\n {8}- [^\n]+)+/;
  const COMMON_NAME = / {2}commonName:[^\n]+/;
  const DNS_NAMES = / {2}dnsNames:(\n {4}- [^\n]+)+/;
  if (DNS_NAMES.test(content)) {
    content = modInline.append(
      content,
      DNS_NAMES,
      `\n    - '{{ (index .Values.ingress.hosts.${
        context.deployment.name
      } 0).name }}'`
    );
  } else {
    content = modInline.append(
      content,
      COMMON_NAME,
      `\n  dnsNames:\n    - '{{ (index .Values.ingress.hosts.${
        context.deployment.name
      } 0).name }}'`
    );
  }
  content = modInline.append(
    content,
    DOMAINS,
    `\n        - '{{ (index .Values.ingress.hosts.${
      context.deployment.name
    } 0).name }}'`
  );
  return content;
}

function processQuestions(content, context) {
  content = content.toString();
  if (context.deployment.public) {
    const INGRESS_ENABLED = / {2}- variable: ingress\.enabled((\n {4}[^\n]+)+)?/;
    const SERVICE_TYPE = / {2}- variable: service\.type((\n {4}[^\n]+)+)?/;
    const SUBQUESTIONS = / {4}subquestions:((\n {6}[^\n]+)+)?/;
    content = modInline.append(
      content,
      [INGRESS_ENABLED, SUBQUESTIONS],
      `\n      - variable: ingress.hosts.${
        context.deployment.name
      }[0].name\n        default: xip.io\n        description: 'hostname to your ${
        context.deployment.name
      } installation'\n        type: hostname\n        required: true\n        label: '${
        context.deployment.name
      } hostname'\n      - variable: ingress.hosts.${
        context.deployment.name
      }[0].path\n        default: /\n        description: 'pathname to your ${
        context.deployment.name
      } installation'\n        type: string\n        required: true\n        label: '${
        context.deployment.name
      } path'`
    );
    content = modInline.append(
      content,
      [SERVICE_TYPE, SUBQUESTIONS],
      `\n      - variable: service.nodePorts.${
        context.deployment.name
      }.http\n        default: ''\n        description: 'NodePort ${
        context.deployment.name
      } http port (to set explicitly, choose port between 30000-32767)'\n        type: int\n        min: 30000\n        max: 32767\n        show_if: ingress.enabled=false&&service.type=NodePort\n        label: '${
        context.deployment.name
      } http port'`
    );
  }
  return content;
}

function processValues(content, context) {
  content = content.toString();
  const IMAGES = /images:((\n {2}[^\n]+)+)?/;
  const { image } = context.deployment;
  content = modInline.append(
    content,
    IMAGES,
    `\n  ${context.deployment.name}:\n    repository: ${image.substr(
      0,
      image.indexOf(':')
    )}\n    tag: ${image.substr(
      image.indexOf(':') + 1
    )}\n    pullPolicy: IfNotPresent`
  );
  if (context.deployment.public) {
    const HOSTS = / {2}hosts:((\n {4}[^\n]+)+)?/;
    const INGRESS = /ingress:((\n {2}[^\n]+)+)/;
    const NODE_PORTS = / {2}nodePorts:((\n {4}[^\n]+)+)?/;
    const SERVICE = /service:((\n {2}[^\n]+)+)/;
    content = modInline.append(
      content,
      [SERVICE, NODE_PORTS],
      `\n    ${context.deployment.name}:\n      http: ''`
    );
    content = modInline.append(
      content,
      [INGRESS, HOSTS],
      `\n    ${context.deployment.name}:\n      - name: ''\n        path: /`
    );
  }
  return content;
}
