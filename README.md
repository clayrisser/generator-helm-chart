# generator-helm-chart

[![GitHub stars](https://img.shields.io/github/stars/codejamninja/generator-helm-chart.svg?style=social&label=Stars)](https://github.com/codejamninja/generator-helm-chart)

> yeoman generator rancher 2 helm charts

Please ★ this repo if you found it useful ★ ★ ★

## Features

- Supports helm
- Supports rancher 2

## Installation

```sh
npm install -g generator-helm-chart
```

## Dependencies

- [NodeJS](https://nodejs.org)
- [Yeoman](http://yeoman.io)

## Usage

### Create a New Helm Chart

```sh
yo helm-chart
```

Below is an example of what you might enter to build an nginx rancher2 helm chart.

```sh
? Project Name: generator-helm-chart
? Project Description: yeoman generator rancher 2 helm charts
? Version: 0.1.0
? License: MIT
? Author Name: Jam Risser
? Author Email: jam@codejam.ninja
? GitHub Username: codejamninja
? Author URL: https://codejamninja.com
? Repository: https://github.com/codejamninja/generator-helm-chart
? Homepage: https://github.com/codejamninja/generator-helm-chart
? Keyword: nginx
? Keyword: server
? Keyword:
? Icon: https://nginx.org/nginx.png
? Workload Name: nginx
? Workload Image: nginx:latest
? Workload Port: 80
? Workload Public: Yes
? Workload Name:
? Config Key: hello
? Config Secret: No
? Config Type: string
? Config Default Value: world
? Config Label: hello
? Config Required: No
? Config Key: shhhh
? Config Secret: Yes
? Config Type: password
? Config Default Value: i-am-a-secret
? Config Description: shhhh
? Config Required: Yes
? Config Key:
   create Chart.yaml
   create OWNERS
   create README.md
   create app-readme.md
   create questions.yaml
   create values.yaml
   create templates/NOTES.txt
   create templates/_helpers.tpl
   create templates/pvc.yaml
   create templates/configmap.yaml
   create templates/secret.yaml
   create templates/deployments/nginx.yaml
   create templates/services/nginx.yaml
   create templates/ingresses/nginx.yaml
Done in 179.02s.
```

### Add Workload to Existing Helm Chart

```sh
yo helm-chart:workload
```

### Add Config to Existing Helm Chart

```sh
yo helm-chart:config
```

## Support

Submit an [issue](https://github.com/codejamninja/generator-helm-chart/issues/new)

## Screenshots

[Contribute](https://github.com/codejamninja/generator-helm-chart/blob/master/CONTRIBUTING.md) a screenshot

## Contributing

Review the [guidelines for contributing](https://github.com/codejamninja/generator-helm-chart/blob/master/CONTRIBUTING.md)

## License

[MIT License](https://github.com/codejamninja/generator-helm-chart/blob/master/LICENSE)

[Jam Risser](https://codejam.ninja) © 2018

## Changelog

Review the [changelog](https://github.com/codejamninja/generator-helm-chart/blob/master/CHANGELOG.md)

## Credits

- [Jam Risser](https://codejam.ninja) - Author

## Support on Liberapay

A ridiculous amount of coffee ☕ ☕ ☕ was consumed in the process of building this project.

[Add some fuel](https://liberapay.com/codejamninja/donate) if you'd like to keep me going!

[![Liberapay receiving](https://img.shields.io/liberapay/receives/codejamninja.svg?style=flat-square)](https://liberapay.com/codejamninja/donate)
[![Liberapay patrons](https://img.shields.io/liberapay/patrons/codejamninja.svg?style=flat-square)](https://liberapay.com/codejamninja/donate)
