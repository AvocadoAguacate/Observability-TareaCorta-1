# Documentación de la Tarea Corta 01

    Tecnológico de Costa Rica
    Escuela de Ingeniería en Computación 
    Bases de Datos II (IC 4302)
    Segundo Semestre 2022

## Integrantes

    David Jose Espinoza Soto - 2016012024
    Esteban Guzmán Ramírez   - 2015095861
    Johnny Díaz Coto         - 2020042119
    Jurgenn Morales Jiménez  - 2016145484

## Guía de instalación y uso de la tarea

En esta sección explicamos como instalamos y ejecutamos los componentes solicitados de la tarea.

### Primeros pasos

Lo primero que se debe hacer es un helm chart llamado monitoring y otro llamado databases, para lograr esto tenemos que ejecutar un comando de 'helm create [nombre del chart]', en nuestro caso serian los siguientes comandos:

```bash
helm create databases
```
```bash
helm create monitoring
```
---
#### Configuración del chart Monitoring
Una vez creados ambos charts lo consiguiente sería agregarles sus dependencias a cada uno de ellos, en el chart `monitoring` vamos a agregar todo lo relacionado al monitoreo de las bases de datos, prometheus y grafana, para esto nos ubicamos en el archivo llamado chart.yaml ubicado dentro de la carpeta monitoring creada por el comando de helm, se agregara lo siguiente:

```yaml
dependencies:
  - name: kube-prometheus
    version: "8.0.16"
    repository: https://charts.bitnami.com/bitnami
    condition: enablePrometheus

  - name: grafana
    version: "8.2.2"
    repository: https://charts.bitnami.com/bitnami
    condition: enableGrafana
    
  - name: prometheus-elasticsearch-exporter
    version: "4.14.0"
    repository: https://prometheus-community.github.io/helm-charts
    condition: enablePrometheusCommunity
```
En esta misma carpeta se encuentra un archivo llamado values.yaml, este es el encargado de sobre-escribir los datos de congiruacion que vienen por defecto con la instalación, en este archivo se agregará lo siguiente:

```yaml
enablePrometheus: true
enableGrafana: true
enablePrometheusCommunity: true
```

Con esto ya el trabajo en el chart de monitoring estaría completo.

#### Chart de Databases

Este chart es el encargado de contener las bases de datos utilizadas, el trabajo en este chart es similar al anterior, dentro de la carpeta que se creó usando el comando de helm create databases, se encuentra un achivo llamado chart.yaml, en él se agrega lo siguiente:

```yaml
dependencies:
  - name: eck-operator
    version: "2.3.0"
    repository: https://helm.elastic.co
    condition: enableECKOperator
  
  - name: mariadb
    version: "11.3.0"
    repository: https://charts.bitnami.com/bitnami
    condition: enableMariaDB
  
  - name: postgresql
    repository: https://charts.bitnami.com/bitnami
    version: "11.8.1"
    condition: enablePostgreSQL

  - name: mongodb
    version: "13.1.2"
    repository: https://charts.bitnami.com/bitnami
    condition: enableMongoDB
```

Mientras que en el values.yaml se agrega:

```yaml
enablePostgreSQL: true
enableMongoDB: true
enableECKOperator: true
enableMariaDB: true
```
Esto como método general, en cada seccion de las bases de datos implementadas se explica la configuracion que se necesita en el values.yaml para que todo funcione.

---
Una vez completados estos pasos se debe realizar la actualizacion de las dependencias de cada uno de los charts, es por eso que nos posicionamos dentro de a carpeta y realizamos los siguientes comandos:

```bash
  helm dependency update
  helm dependecy build
```

### API
Nos movemos a la carpeta del api, en caso de estar en la carpeta raíz del proyecto usariamos el comando
  ```shell
  cd api
  ```
Instalamos dependencias con 
  ```shell
npm install 
  ```
Para correr el servidor se usa el comando
  ```shell
  npm start
  ```
## Configuración de las herramientas

(haciendo énfasis en los valores utilizados para cada una)

### Configuración de MariaDB
Se cambian los valores en el archivo values.yaml para solo prender la base de datos indicada:
  ```yaml
enablePostgreSQL: false
enableMongoDB: false
enableECKOperator: false
enableMariaDB: true
  ```
Para configurar los pods de MariaDB se utiliza la siguiente configuración:
  ```yaml
architecture: replication
secondary:
    replicaCount: 2
metrics:
    enabled: true
    serviceMonitor:
      enabled: true
  ```

### Configuración de MongoDB
Se cambian los valores en el archivo values.yaml para solo prender la base de datos indicada:
  ```yaml
enablePostgreSQL: false
enableMongoDB: true
enableECKOperator: false
enableMariaDB: false
  ```
Para configurar los pods de MongoDB se utiliza la siguiente configuración:
  ```yaml
  mong
  odb:
  architecture: replicaset
  replicaCount: 3
  auth:
    enabled: false
  readinessProbe:
    enabled: true
    initialDelaySeconds: 5
    periodSeconds: 10
    timeoutSeconds: 5
    failureThreshold: 6
    successThreshold: 1
  ```

### Configuración de Elasticsearch

Elastisearch necesita

### Configuración de PostgreSQL

Se cambian los valores en el archivo values.yaml para solo prender la base de datos indicada:
  ```yaml
enablePostgreSQL: true
enableMongoDB: false
enableECKOperator: false
enableMariaDB: false
  ```
Para configurar el pod de PostgreSQL se utiliza la siguiente configuración:
  ```yaml
postgresql:  
  metrics:
    enabled: true
    serviceMonitor:
      enabled: true 
  auth:
    postgresPassword: "rootroot"
    username: "root"
    password: "rootroot"
    database: "sampleDB"
    existingSecret: ""
    secretKeys:
      adminPasswordKey: ""
      userPasswordKey: ""
      replicationPasswordKey: ""

  ```

## Pruebas de carga realizadas

Se debe especificar el tipo de datos que se están almacenando (dataset), tipo de prueba (creación, borrado, actualización y búsqueda), parámetros utilizados (configuración de Gatling), resultados (apoyados por la información de monitoreo y gráficos obtenidos) y conclusiones de la prueba, se deben incluir al menos 5 pruebas por motor de búsqueda

### Pruebas de carga para MariaDB

### Pruebas de carga para MongoDB

### Pruebas de carga para Elasticsearch

### Pruebas de carga para PostgreSQL

## Conclusiones de la tarea corta

