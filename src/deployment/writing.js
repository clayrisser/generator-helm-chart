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
    // yo.fs.copyTpl(
    //   yo.templatePath('templates/certificate.yaml'),
    //   yo.destinationPath('templates/certificate.yaml'),
    //   yo.context
    // );
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
