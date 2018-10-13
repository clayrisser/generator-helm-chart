import _ from 'lodash';

export default async function writing(yo) {
  yo.fs.copyTpl(
    yo.templatePath('template/shared/Chart.yaml'),
    yo.destinationPath('Chart.yaml'),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('template/shared/OWNERS'),
    yo.destinationPath('OWNERS'),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('template/shared/README.md'),
    yo.destinationPath('README.md'),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('template/shared/app-readme.md'),
    yo.destinationPath('app-readme.md'),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('template/shared/questions.yaml'),
    yo.destinationPath('questions.yaml'),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('template/shared/values.yaml'),
    yo.destinationPath('values.yaml'),
    yo.context
  );
  if (_.find(yo.context.deployments, deployment => deployment.public)) {
    yo.fs.copyTpl(
      yo.templatePath('template/shared/templates/certificate.yaml'),
      yo.destinationPath('template/certificate.yaml'),
      yo.context
    );
  }
  const configMaps = _.filter(yo.context.config, { secret: false });
  if (configMaps.length) {
    yo.fs.copyTpl(
      yo.templatePath('template/shared/templates/configmap.yaml'),
      yo.destinationPath('template/configmap.yaml'),
      {
        ...yo.context,
        configMaps
      }
    );
  }
  const configSecrets = _.filter(yo.context.config, { secret: true });
  if (configSecrets.length) {
    yo.fs.copyTpl(
      yo.templatePath('template/shared/templates/secret.yaml'),
      yo.destinationPath('template/secret.yaml'),
      {
        ...yo.context,
        configSecrets
      }
    );
  }
  // yo.context.deployments.forEach(deployment => {
  //   const context = {
  //     ...yo.context,
  //     deployment
  //   };
  //   if (deployment.public) {
  //     yo.fs.copyTpl(
  //       yo.templatePath('template/shared/template/deployments/public.yaml'),
  //       yo.destinationPath(`template/deployments/${deployment.name}.yaml`),
  //       context
  //     );
  //     yo.fs.copyTpl(
  //       yo.templatePath('template/shared/template/services/public.yaml'),
  //       yo.destinationPath(`template/services/${deployment.name}.yaml`),
  //       context
  //     );
  //     yo.fs.copyTpl(
  //       yo.templatePath('template/shared/template/ingress.yaml'),
  //       yo.destinationPath(`template/ingresses/${deployment.name}.yaml`),
  //       context
  //     );
  //   } else {
  //     yo.fs.copyTpl(
  //       yo.templatePath('template/shared/template/deployments/private.yaml'),
  //       yo.destinationPath(`template/deployments/${deployment.name}.yaml`),
  //       yo.context
  //     );
  //     yo.fs.copyTpl(
  //       yo.templatePath('template/shared/template/services/private.yaml'),
  //       yo.destinationPath(`template/services/${deployment.name}.yaml`),
  //       context
  //     );
  //   }
  // });
}
