# Observability-TareaCorta-1

    Tecnológico de Costa Rica
    Escuela de Ingeniería en Computación 
    Bases de Datos II (IC 4302)
    Segundo Semestre 2022

## Integrantes

    David Jose Espinoza Soto - 2016012024
    Esteban Guzmán Ramírez   - 2015095861
    Johnny Díaz Coto         - 2020042119
    Jurgenn

## Objetivo General

- Implementar una solución de Observability para bases de datos SQL y NoSQL.

## Objetivos Específicos

- Instalar y configurar motores de bases de datos SQL y NoSQL mediante Kubernetes.
- Instalar y configurar una solución de monitoreo y alertas utilizando Prometheus y Grafana.
- Implementar pruebas de carga sobre bases de datos SQL y NoSQL mediante el uso de la herramienta Gatling.

## Datos generales

- Vale un 7%, y lo aprendido se implementara en el proyecto.
- Fecha de entrega: **09/09/2022 antes de las 11:30 pm**

## Descripción

Tenemos que implementar una solución de monitoreo con las siguientes herramientas

- Prometheus:
  - 'https://bitnami.com/stack/prometheus-operator/helm'
- Grafana:
  - 'https://bitnami.com/stack/grafana/helm'
- MariaDB (versión OpenSource de MySQL):
  - 'https://bitnami.com/stack/mariadb/helm'
  - mínimo de 3 instancias con un primary y dos replicas.
- MongoDB
  - 'https://bitnami.com/stack/mongodb/helm'
  - mínimo de 3 replicas
- Elasticsearch:
  - 'https://www.elastic.co/guide/en/cloud-on-k8s/2.2/index.html'
  - mínimo de 3 data nodes con un máster node
- PostgreSQL:
  - 'https://bitnami.com/stack/postgresql/helm'

Despues se deberá generar pruebas de carga con Gatling, las mismas realizaran en los motores de bases de datos los siguientes tipos de pruebas:

- Creación de registros/documentos.
- Borrado de registros/documentos.
- Actualización de registros/documentos.
- Búsquedas de registros/documentos.

Estas pruebas deberán correr por largos periodos de tiempo (al menos 30 minutos), para permitir generar gráficos de monitoreo donde se pueda observar el comportamiento de los diferentes motores de bases de datos, es importante observar los siguientes parámetros (no todas las bases de datos los exponen):

- Disco.
- Memoria.
- CPU.
- Network.
- File Descriptors.
- IOPS.
- Open Connections.
- Queries per second.
- Query response time.
- Thread Pools

La idea detrás de las pruebas de carga es medir el rendimiento de las bases de datos con una configuración especifica.


## Evaluación

| Funcionalidad / Requerimiento | Procentaje |
|-----------------------------|:-----:|
| Helm Charts | 50% |
| Pruebas Gatling | 25% |
| Documentación | 25% |
