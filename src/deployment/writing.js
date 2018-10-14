import path from 'path';

export default async function writing(yo) {
  // yo.fs.copyTpl(
  //   yo.templatePath('questions.yaml'),
  //   yo.destinationPath('questions.yaml'),
  //   yo.context
  // );
  // yo.fs.copyTpl(
  //   yo.templatePath('values.yaml'),
  //   yo.destinationPath('values.yaml'),
  //   yo.context
  // );
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
  let matches = content.match(DNS_NAMES);
  if (matches && matches.length) {
    const match = matches[0];
    content = content.replace(
      match,
      `${match}
    - '{{ (index .Values.ingress.hosts.${context.deployment.name} 0).name }}'`
    );
  } else {
    matches = content.match(COMMON_NAME);
    if (matches && matches.length) {
      const match = matches[0];
      content = content.replace(
        match,
        `${match}
  dnsNames:
    - '{{ (index .Values.ingress.hosts.${context.deployment.name} 0).name }}'`
      );
    }
  }
  matches = content.match(DOMAINS);
  if (matches && matches.length) {
    const match = matches[0];
    content = content.replace(
      match,
      `${match}
        - '{{ (index .Values.ingress.hosts.${
          context.deployment.name
        } 0).name }}'`
    );
  }
  return content;
}
