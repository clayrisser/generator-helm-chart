import path from 'path';
import _ from 'lodash';

export default async function writing(yo) {
  // yo.fs.copyTpl(
  //   yo.templatePath('questions.yaml'),
  //   yo.destinationPath('questions.yaml'),
  //   yo.context
  // );
  yo.fs.copy(
    path.resolve(process.cwd(), 'values.yaml'),
    yo.destinationPath('values.yaml'),
    { process: content => processValues(content, yo.context) }
  );
  if (yo.context.deployment.public) {
    yo.fs.copy(
      path.resolve(process.cwd(), 'templates/certificate.yaml'),
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
    content = inline.append(
      content,
      DNS_NAMES,
      `\n    - '{{ (index .Values.ingress.hosts.${
        context.deployment.name
      } 0).name }}'`
    );
  } else {
    content = inline.append(
      content,
      COMMON_NAME,
      `\n  dnsNames:\n    - '{{ (index .Values.ingress.hosts.${
        context.deployment.name
      } 0).name }}'`
    );
  }
  content = inline.append(
    content,
    DOMAINS,
    `\n        - '{{ (index .Values.ingress.hosts.${
      context.deployment.name
    } 0).name }}'`
  );
  return content;
}

function processValues(content, context) {
  content = content.toString();
  const IMAGES = /images:((\n {2}[^\n]+)+)?/;
  const { image } = context.deployment;
  content = inline.append(
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
    content = inline.append(
      content,
      [SERVICE, NODE_PORTS],
      `\n    ${context.deployment.name}:\n      http: ''`
    );
    content = inline.append(
      content,
      [INGRESS, HOSTS],
      `\n    ${context.deployment.name}:\n      - name: ''\n        path: /`
    );
  }
  return content;
}

const inline = {
  append(content, regexes, appendValue) {
    if (!_.isArray(regexes)) regexes = [regexes];
    if (regexes.length > 1) {
      const regex = regexes[0];
      const isolatedContent = inline.isolate(content, regex);
      content = content.replace(
        isolatedContent,
        inline.append(isolatedContent, [...regexes].pop(), appendValue)
      );
    } else {
      const regex = regexes[0];
      const matches = content.match(regex);
      if (matches && matches.length) {
        const match = matches[0];
        content = content.replace(match, `${match}${appendValue}`);
      }
    }
    return content;
  },
  isolate(content, regex) {
    const matches = content.match(regex);
    if (matches && matches.length) {
      const match = matches[0];
      return match;
    }
    return null;
  }
};
