import _ from 'lodash';

export default async function writing(yo) {
  const configMaps = _.filter(yo.context.config, { secret: false });
  const configSecrets = _.filter(yo.context.config, { secret: true });
  const publicWorkloads = _.filter(yo.context.workloads, { public: true });
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
      publicWorkloads
    }
  );
  yo.fs.copyTpl(
    yo.templatePath('values.yaml'),
    yo.destinationPath(`v${yo.context.version}/values.yaml`),
    {
      ...yo.context,
      publicWorkloads
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
  yo.fs.copyTpl(
    yo.templatePath('templates/pvc.yaml'),
    yo.destinationPath(`v${yo.context.version}/templates/pvc.yaml`),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('templates/secrets/backup.yaml'),
    yo.destinationPath(`v${yo.context.version}/templates/secrets/backup.yaml`),
    yo.context
  );
  if (
    _.includes(
      _.map(yo.context.workloads, workload => !!workload.volumes.length),
      true
    )
  ) {
    yo.fs.copyTpl(
      yo.templatePath('templates/backups/data.yaml'),
      yo.destinationPath(`v${yo.context.version}/templates/backups/data.yaml`),
      yo.context
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
      yo.context
    );
    if (workload.public) {
      yo.fs.copyTpl(
        yo.templatePath('templates/services/public.yaml'),
        yo.destinationPath(
          `v${yo.context.version}/templates/services/${workload.name}.yaml`
        ),
        context
      );
      yo.fs.copyTpl(
        yo.templatePath('templates/ingress.yaml'),
        yo.destinationPath(
          `v${yo.context.version}/templates/ingresses/${workload.name}.yaml`
        ),
        context
      );
    } else {
      yo.fs.copyTpl(
        yo.templatePath('templates/services/private.yaml'),
        yo.destinationPath(
          `v${yo.context.version}/templates/services/${workload.name}.yaml`
        ),
        context
      );
    }
  });
  yo.context.databases.forEach(database => {
    const context = {
      ...database,
      ...yo.context
    };
    yo.fs.copyTpl(
      yo.templatePath(`templates/databases/${database.name}.yaml`),
      yo.destinationPath(
        `v${yo.context.version}/templates/databases/${database.name}.yaml`
      ),
      context
    );
    yo.fs.copyTpl(
      yo.templatePath(`templates/deployments/${database.explorer.name}.yaml`),
      yo.destinationPath(
        `v${yo.context.version}/templates/deployments/${database.explorer.name}.yaml`
      ),
      context
    );
    yo.fs.copyTpl(
      yo.templatePath(`templates/configmaps/${database.name}.yaml`),
      yo.destinationPath(
        `v${yo.context.version}/templates/configmaps/${database.name}.yaml`
      ),
      context
    );
    yo.fs.copyTpl(
      yo.templatePath(`templates/ingresses/${database.explorer.name}.yaml`),
      yo.destinationPath(
        `v${yo.context.version}/templates/ingresses/${database.explorer.name}.yaml`
      ),
      context
    );
    yo.fs.copyTpl(
      yo.templatePath(`templates/services/${database.explorer.name}.yaml`),
      yo.destinationPath(
        `v${yo.context.version}/templates/services/${database.explorer.name}.yaml`
      ),
      context
    );
    if (
      database.name === 'mysql' ||
      database.name === 'mongodb' ||
      database.name === 'postgres' ||
      database.name === 'elasticsearch'
    ) {
      yo.fs.copyTpl(
        yo.templatePath(`templates/backups/${database.name}.yaml`),
        yo.destinationPath(
          `v${yo.context.version}/templates/backups/${database.name}.yaml`
        ),
        yo.context
      );
    }
  });
}
