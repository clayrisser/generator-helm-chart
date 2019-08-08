{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "<%- name %>.name" }}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this
(by the DNS naming spec).
*/}}
{{- define "<%- name %>.fullname" }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a name shared accross all apps in namespace.
We truncate at 63 chars because some Kubernetes name fields are limited to this
(by the DNS naming spec).
*/}}
{{- define "<%- name %>.sharedname" }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- printf "%s-%s" .Release.Namespace $name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Calculate certificate
*/}}
{{- define "<%- name %>.certificate" }}
{{- if (not (empty .Values.ingress.certificate)) }}
{{- printf .Values.ingress.certificate }}
{{- else }}
{{- printf "%s-letsencrypt" (include "<%- name %>.fullname" .) }}
{{- end }}
{{- end }}

{{/*
Calculate hostname
*/}}
{{- define "<%- name %>.hostname" }}
{{- if (and .Values.config.hostname (not (empty .Values.config.hostname))) }}
{{- printf .Values.config.hostname }}
{{- else }}
{{- if .Values.ingress.enabled }}
{{- printf (index .Values.ingress.hosts.<%- name %> 0).name }}
{{- else }}
{{- printf "%s-<%- name %>" (include "<%- name %>.fullname" .) }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Calculate base_url
*/}}
{{- define "<%- name %>.base_url" }}
{{- if (and .Values.config.baseUrl (not (empty .Values.config.baseUrl))) }}
{{- printf .Values.config.baseUrl }}
{{- else }}
{{- if .Values.ingress.enabled }}
{{- $host := ((empty (include "<%- name %>.hostname" .)) | (index .Values.ingress.hosts.<%- name %> 0) (include "<%- name %>.hostname" . )) }}
{{- $protocol := (.Values.ingress.tls | ternary "https" "http") }}
{{- $path := (eq $host.path "/" | ternary "" $host.path) }}
{{- printf "%s://%s%s" $protocol $host.name $path }}
{{- else }}
{{- if (empty (include "<%- name %>.hostname" . )) }}
{{- printf "http://%s-<%- name %>" (include "<%- name %>.hostname" .) }}
{{- else }}
{{- printf "http://%s" (include "<%- name %>.hostname" .) }}
{{- end }}
{{- end }}
{{- end }}
{{- end }}
<%- include('./helpers/databases'); %>
