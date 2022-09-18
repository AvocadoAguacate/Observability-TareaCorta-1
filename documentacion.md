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


## Comenzando desde 0
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
El chart de monitoring es el encargado de contener las herramientas sobre la monitorizacion de las herramientas, es por eso que se debe agregar las siguientes dependencias al archivo Chart.yaml:

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

#### Configuración del Chart de Databases

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

### Instalación
Una vez con todo configurado lo que se debe hacer es instalar todo con el comando:
```bash
helm install [name][chart]
```
Por lo que en nuestra tarea se realizaria de la siguiente manera:

```bash
helm install databases databases
```

```bash
helm install monitoring monitoring
```

Ya con estos comandos y con la configuración completa, todo debería estar inicializandose, esto lo podriamos comprobar en la aplicación de *Lens* o con el comando:

```bash
kubectl get all
```
Para obtener un listado de pods, servicios, deployment, etc.

## Charts existentes

En nuestro caso con los charts ya creados solo se deben realizar los ultimos comandos de Helm:

```bash
helm dependency update
helm install [name][chart]
```


### API
Nos movemos a la carpeta del api, en caso de estar en la carpeta raíz del proyecto usariamos el comando
  ```shell
  cd api
  ```
Instalamos dependencias con:
  ```shell
npm install 
  ```
Para correr el servidor se usa el comando
  ```shell
  npm start
  ```
## Configuración de las herramientas

Haciendo énfasis en los valores utilizados para cada una.

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

La implementación de Elastisearch ha sufrido de varias complicaciones, y después de varios intentos se siguieron las indicaciones de Gabriel Bauer de uno de sus blogs, para implementar un servicio de elasticsearch y monitorearlo con Prometeus.

Se implementa un nodo master con tres nodos de datos, original eran 3 master - 3 data distribuidos en 3 zonas de disponibilidad, modificado para solo usar una zona.

Como primer paso, tanto en la guía de Bauer como en la página oficial de Elasticsearch, se necesitan instalar las definiciones de recursos personalizadas de Kubernetes, las reglas RBAC y un StatefulSet para el pod elastic-operator.

```bash
kubectl apply -f https://download.elastic.co/downloads/eck/1.2.1/all-in-one.yaml
```

A veces me funcionaba con el comando de arriba, pero tambien se puede utilizar el siguiente comando para descargar los recursos personalizados.

```bash
kubectl create -f https://download.elastic.co/downloads/eck/2.2.0/crds.yaml
```

Ambos comandos crean, en nuestro clúster de Kubernetes, las siguientes partes para operar Elasticsearch:

- Todas las definiciones de recursos personalizadas necesarias
- Todos los permisos RBAC que se necesitan
- Un espacio de nombres para el operador (elastic-system)
- Un StatefulSet para el Elastic Operator-Pod

Tambien utiliza el siguiente comando para instalar el operador con sus reglas RBAC. Aunque hay que esperar un tiempo a que el primer comando termine de instarlo todo.

```bash
kubectl apply -f https://download.elastic.co/downloads/eck/2.2.0/operator.yaml
```

Una vez preparado el ambiente, simplemente se aplica el siguiente comando para instalar todos los pod de elastic, el de kibana, el monitor y crea los namespace donde todos los pods anteriores se van creando.

```bash
kubectl apply -f elasticsearch-tarea01.yaml
```

Para habilitar el monitoreo de prometeus primero se debe instalar un plugin en el clúster de Elasticsearch que exponga la información en el formato correcto bajo /_prometheus/metrics.

```yaml
# en el nodo master, le agrego lo siguiente
- name: install-plugins
         command:
         - sh
         - -c
         - |
          bin/elasticsearch-plugin install -b repository-s3 https://github.com/vvanholl/elasticsearch-prometheus-exporter/releases/download/7.7.0.0/prometheus-exporter-7.7.0.0.zip
```

Por ultimo creamos un ServiceMonitor porque estamos utilizando el operador Prometheus para monitorear las aplicaciones internas de Kubernetes. (Este se encuentra al final del archivo elasticsearch-tarea01.yaml).

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

## Pruebas de Carga
Para esta sección no se logró realizar exitosamente las pruebas de carga por lo que no se puede afirmar nada.

## Conclusiones de la tarea corta

La instalación de la mayoría de las bases de datos necesarias fueron instaladas exitosamente, se logró crear replicas de las bases de datos que corresponden, al momento de la configuración de la herrmienta ElasticSearch se logro implementar un solo nodo, las replicas no se lograron.
Al momento de realizar pruebas de carga no se lograron con la herramienta de Gatling, sin embargo se logrón un API para hacer consultas en MongoDB.

El ultimo error que tubimos con Elasticsearch decia lo siguiente:

```
error: error validating "elasticsearch-tarea01.yaml": error validating data: [ValidationError(ServiceMonitor.spec): unknown field "accessModes" in com.coreos.monitoring.v1.ServiceMonitor.spec, ValidationError(ServiceMonitor.spec): unknown field "resources" in com.coreos.monitoring.v1.ServiceMonitor.spec]; if you choose to ignore these errors, turn validation off with --validate=false
```
