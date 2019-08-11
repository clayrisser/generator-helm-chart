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
{{- end }}

{{/*
Create a name shared accross all apps in namespace.
We truncate at 63 chars because some Kubernetes name fields are limited to this
(by the DNS naming spec).
*/}}
{{- define "<%- _.kebabCase(name) %>.sharedname" }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- printf "%s-%s" .Release.Namespace $name | trunc 63 | trimSuffix "-" }}
{{- end }}<% for (var i = 0; i < publicWorkloads.length; i++) { workload = publicWorkloads[i]; %>

{{/*
Calculate <%- _.snakeCase(workload.name).replace(/_/g, ' ') %> certificate
*/}}
{{- define "<%- _.kebabCase(name) %>.<%- _.kebabCase(workload.name) %>-certificate" }}
{{- if (not (empty .Values.ingress.<%- workload.name %>.certificate)) }}
{{- printf .Values.ingress.<%- workload.name %>.certificate }}
{{- else }}
{{- printf "%s-<%- _.kebabCase(workload.name) %>-letsencrypt" (include "<%- name %>.fullname" .) }}
{{- end }}
{{- end }}<% } for (var i = 0; i < databases.length; i++) { database = databases[i]; %>

{{/*
Calculate <%- _.snakeCase(database.explorer.name).replace(/_/g, ' ') %> certificate
*/}}
{{- define "<%- _.kebabCase(name) %>.<%- _.kebabCase(database.explorer.name) %>-certificate" }}
{{- if (not (empty .Values.ingress.<%- database.explorer.name %>.certificate)) }}
{{- printf .Values.ingress.<%- database.explorer.name %>.certificate }}
{{- else }}
{{- printf "%s-<%- database.explorer.name %>-letsencrypt" (include "<%- name %>.fullname" .) }}
{{- end }}
{{- end }}<% } for (var i = 0; i < workloads.length; i++) { workload = workloads[i]; %>

{{/*
Calculate <%- _.snakeCase(workload.name).replace(/_/g, ' ') %> hostname
*/}}
{{- define "<%- _.kebabCase(name) %>.<%- _.kebabCase(workload.name) %>-hostname" }}
{{- if (and .Values.config.<%- _.snakeCase(workload.name) %>.hostname (not (empty .Values.config.<%- _.snakeCase(workload.name) %>.hostname))) }}
{{- printf .Values.config.<%- _.snakeCase(workload.name) %>.hostname }}
{{- else }}<% if (workload.public) { %>
{{- if .Values.ingress.<%- workload.name %>.enabled }}
{{- printf .Values.ingress.<%- workload.name %>.hostsname }}
{{- else }}<% } %>
{{- printf "%s-<%- _.kebabCase(workload.name) %>" (include "<%- name %>.fullname" .) }}<% if (workload.public) { %>
{{- end }}
{{- end }}
{{- end }}

{{/*
Calculate <%- _.snakeCase(workload.name).replace(/_/g, ' ') %> base url
*/}}
{{- define "<%- _.kebabCase(name) %>.<%- _.kebabCase(workload.name %>-base-url" }}
{{- if (and .Values.config.<%- _.snakeCase(workload.name) %>.baseUrl (not (empty .Values.config.<%- _.snakeCase(workload.name) %>.baseUrl))) }}
{{- printf .Values.config.<%- _.snakeCase(workload.name) %>.baseUrl }}
{{- else }}
{{- if .Values.ingress.<%- workload.name %>.enabled }}
{{- $hostname := ((empty (include "<%- name %>.<%- workload.name %>_hostname" .)) | ternary .Values.ingress.<%- workload.name %>.hostname (include "<%- name %>.<%- workload.name %>_hostname" .)) }}
{{- $path := (eq .Values.ingress.<%- workload.name %>.path "/" | ternary "" .Values.ingress.<%- workload.name %>.path) }}
{{- $protocol := (.Values.ingress.<%- workload.name %>.tls | ternary "https" "http") }}
{{- printf "%s://%s%s" $protocol $hostname $path }}
{{- else }}
{{- printf "http://%s" (include "<%- name %>.<%- workload.name %>_hostname" .) }}
{{- end }}<% } %>
{{- end }}
{{- end }}<% } %>
<%- include('./helpers/databases'); %>
