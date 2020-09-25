{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "<%- _.kebabCase(name) %>.name" }}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this
(by the DNS naming spec).
*/}}
{{- define "<%- _.kebabCase(name) %>.fullname" }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}<% for (var i = 0; i < publicWorkloads.length; i++) { workload = publicWorkloads[i]; %>

{{/*
Calculate <%- spaceCase(workload.name) %> certificate
*/}}
{{- define "<%- _.kebabCase(name) %>.<%- _.kebabCase(workload.name) %>-certificate" }}
{{- if (not (empty .Values.ingress.<%- _.camelCase(workload.name) %>.certificate)) }}
{{- printf .Values.ingress.<%- _.camelCase(workload.name) %>.certificate }}
{{- else }}
{{- printf "%s-<%- _.kebabCase(workload.name) %>-letsencrypt" (include "<%- _.kebabCase(name) %>.fullname" .) }}
{{- end }}
{{- end }}

{{/*
Calculate <%- spaceCase(workload.name) %> hostname
*/}}
{{- define "<%- _.kebabCase(name) %>.<%- _.kebabCase(workload.name) %>-hostname" }}
{{- if (and .Values.config.<%- _.camelCase(workload.name) %>.hostname (not (empty .Values.config.<%- _.camelCase(workload.name) %>.hostname))) }}
{{- printf .Values.config.<%- _.camelCase(workload.name) %>.hostname }}
{{- else }}<% if (workload.public) { %>
{{- if .Values.ingress.<%- _.camelCase(workload.name) %>.enabled }}
{{- printf .Values.ingress.<%- _.camelCase(workload.name) %>.hostname }}
{{- else }}<% } %>
{{- printf "%s-<%- _.kebabCase(workload.name) %>" (include "<%- _.kebabCase(name) %>.fullname" .) }}<% if (workload.public) { %>
{{- end }}
{{- end }}
{{- end }}

{{/*
Calculate <%- spaceCase(workload.name) %> base url
*/}}
{{- define "<%- _.kebabCase(name) %>.<%- _.kebabCase(workload.name) %>-base-url" }}
{{- if (and .Values.config.<%- _.camelCase(workload.name) %>.baseUrl (not (empty .Values.config.<%- _.camelCase(workload.name) %>.baseUrl))) }}
{{- printf .Values.config.<%- _.camelCase(workload.name) %>.baseUrl }}
{{- else }}
{{- if .Values.ingress.<%- _.camelCase(workload.name) %>.enabled }}
{{- $hostname := ((empty (include "<%- _.kebabCase(name) %>.<%- _.kebabCase(workload.name) %>-hostname" .)) | ternary .Values.ingress.<%- _.camelCase(workload.name) %>.hostname (include "<%- _.kebabCase(name) %>.<%- _.kebabCase(workload.name) %>-hostname" .)) }}
{{- $protocol := (.Values.ingress.<%- _.camelCase(workload.name) %>.tls | ternary "https" "http") }}
{{- printf "%s://%s" $protocol $hostname }}
{{- else }}
{{- printf "http://%s" (include "<%- _.kebabCase(name) %>.<%- _.kebabCase(workload.name) %>-hostname" .) }}
{{- end }}<% } %>
{{- end }}
{{- end }}<% } %><%- include('./helpers/databases'); %>
