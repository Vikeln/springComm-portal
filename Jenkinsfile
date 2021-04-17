pipeline {
    agent any
    environment {
        VERSION = "1.1"
        workspace = pwd()
        serviceName = "mobiconnect-portal"
        registryCredential = "TmwauraHarb"
        ImageName = "harb.diab.mfs.co.ke/total-mobiconnect/${serviceName}:${VERSION}.${BUILD_NUMBER}"
    }

 
    stages {
        stage ('Clone Repository'){
            steps {
                checkout scm
            }
        }
        // stage ('Sonar scan'){
            
        //     steps {
        //         sh ''' echo "RUNNING CODE ANALYSIS" '''
        //         sh '/opt/sonar-cli/bin/sonar-scanner -Dsonar.projectKey=prsp-rebuild-portal -Dsonar.sources=./src -Dsonar.host.url=http://10.38.83.165:9000 -Dsonar.login=43fa108a90ff22212472e18a23d806a119679483'
        //     }
        // }
        stage ('Build Production Files') {
            steps {
              sh 'npm i'
              sh 'npm run build --prefer-offline --no-audit'
            }
        }
        stage('Build Docker Image'){
            steps {
               script{
                app = docker.build("${ImageName}")
                }
             }
        }
        stage('Push Image to Docker Registry') {
          steps{
            script {
              docker.withRegistry("https://harb.diab.mfs.co.ke","TmwauraHarb"){
                appname = app.push("${VERSION}.${BUILD_NUMBER}")
              }
            }
          }
        }
 
        stage("Deploy For Test on K8s"){
            steps{
                sh "sed -i 's|ImageName|${ImageName}|' Kubernetes/deployment.yaml"
                sh "kubectl apply -f Kubernetes/deployment.yaml"
            }
        }
    }
}
