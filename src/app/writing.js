import _ from 'lodash';

export default async function writing(yo) {
  const configMaps = _.filter(yo.context.config, { secret: false });
  const configSecrets = _.filter(yo.context.config, { secret: true });
  const publicWorkloads = _.filter(yo.context.workloads, { public: true });
  const hasData = _.includes(
    _.map(yo.context.workloads, workload => !!workload.volumes.length),
    true
  );
  yo.fs.copyTpl(
    yo.templatePath('Chart.yaml'),
    yo.destinationPath(`v${yo.context.version}/Chart.yaml`),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('OWNERS'),
    yo.destinationPath(`v${yo.context.version}/OWNERS`),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('README.md'),
    yo.destinationPath(`v${yo.context.version}/README.md`),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('app-readme.md'),
    yo.destinationPath(`v${yo.context.version}/app-readme.md`),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('questions.yaml'),
    yo.destinationPath(`v${yo.context.version}/questions.yaml`),
    {
      ...yo.context,
      publicWorkloads,
      hasData
    }
  );
  yo.fs.copyTpl(
    yo.templatePath('values.yaml'),
    yo.destinationPath(`v${yo.context.version}/values.yaml`),
    {
      ...yo.context,
      publicWorkloads,
      hasData
    }
  );
  yo.fs.copyTpl(
    yo.templatePath('templates/NOTES.txt'),
    yo.destinationPath(`v${yo.context.version}/templates/NOTES.txt`),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('templates/_helpers.tpl'),
    yo.destinationPath(`v${yo.context.version}/templates/_helpers.tpl`),
    {
      ...yo.context,
      publicWorkloads
    }
  );
  if (hasData) {
    yo.fs.copyTpl(
      yo.templatePath('templates/backup.yaml'),
      yo.destinationPath(`v${yo.context.version}/templates/backup.yaml`),
      { ...yo.context, hasData }
    );
  }
  if (configMaps.length || yo.context.databases?.length) {
    yo.fs.copyTpl(
      yo.templatePath('templates/configmap.yaml'),
      yo.destinationPath(`v${yo.context.version}/templates/configmap.yaml`),
      {
        ...yo.context,
        configMaps
      }
    );
  }
  if (configSecrets.length || yo.context.databases?.length) {
    yo.fs.copyTpl(
      yo.templatePath('templates/secret.yaml'),
      yo.destinationPath(`v${yo.context.version}/templates/secret.yaml`),
      {
        ...yo.context,
        configSecrets
      }
    );
  }
  yo.context.databases.forEach(database => {
    if (database.name !== 'mysql' && database.name !== 'postgres') return;
    yo.fs.copyTpl(
      yo.templatePath(`templates/integrations/external-${database.name}.yaml`),
      yo.destinationPath(
        `v${yo.context.version}/templates/integrations/external-${database.name}.yaml`
      ),
      {
        ...yo.context,
        database
      }
    );
  });
  yo.context.workloads.forEach(workload => {
    const context = {
      ...yo.context,
      workload
    };
    yo.fs.copyTpl(
      yo.templatePath('templates/deployment.yaml'),
      yo.destinationPath(
        `v${yo.context.version}/templates/deployments/${workload.name}.yaml`
      ),
      context
    );
    yo.fs.copyTpl(
      yo.templatePath('templates/service.yaml'),
      yo.destinationPath(
        `v${yo.context.version}/templates/services/${workload.name}.yaml`
      ),
      context
    );
    if (workload.volumes.length) {
      yo.fs.copyTpl(
        yo.templatePath('templates/pvc.yaml'),
        yo.destinationPath(
          `v${yo.context.version}/templates/pvcs/${workload.name}.yaml`
        ),
        context
      );
    }
    if (workload.public) {
      yo.fs.copyTpl(
        yo.templatePath('templates/ingress.yaml'),
        yo.destinationPath(
          `v${yo.context.version}/templates/ingresses/${workload.name}.yaml`
        ),
        context
      );
    }
  });
}
