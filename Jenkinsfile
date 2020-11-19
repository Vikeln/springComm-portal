pipeline {
    agent any
    environment {
        VERSION = "1.1"
        workspace = pwd()
        serviceName = "mobiconnect-portal"
        registryCredential = "TmwauraHarb"
        ImageName = "harb.diab.mfs.co.ke/tango/${serviceName}:${VERSION}.${BUILD_NUMBER}"
    }
    
 
    stages {
        stage ('Clone Repository'){
            steps {
                checkout scm
            }
        }
        stage ('Build Jar File') {
            steps {
              sh 'npm i'
              sh 'npm run build'
            }
        }
        stage ('Sonar scan'){
            
            steps {
                sh ''' echo "RUNNING CODE ANALYSIS" '''
                sh '/opt/sonar-cli/bin/sonar-scanner -Dsonar.projectKey=mobiconnect-portal -Dsonar.sources=. -Dsonar.host.url=http://10.38.83.165:9000 -Dsonar.login=3903b75eb10e4e1011151038b95b18eb491ba26f'
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
