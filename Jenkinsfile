pipeline {
  environment {
    registry = "speminipro/covid-repo"
    registryCredential = 'docker-hub-credentials'
    dockerImage = ''
    dockerImageLatest = ''
  }
  agent any
  tools {nodejs "nodejs"}
  stages {
    stage('Cloning Git') {
      steps {
        git 'https://github.com/VipinRaiP/spe-covid19'
      }
    }
    stage('Build Angular Project'){
        steps {
            sh 'npm i'
            sh 'ng build'
            // sh 'cd backend'
          
            // sh  'cd ..'
            
            dir("backend") {
                sh "pwd"
                sh 'npm i'
            }
        }
    }
    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build registry + ":$BUILD_NUMBER"
          dockerImageLatest = docker.build registry + ":latest"
        }
      }
    }
    stage('Deploy Image') {
      steps{
        script {
          docker.withRegistry( '', registryCredential ) {
            dockerImage.push()
            dockerImageLatest.push()
          }
        }
      }
    }
    stage('Remove Unused docker image') {
      steps{
        sh "docker rmi $registry:$BUILD_NUMBER"
      }
    }
    stage('Execute Rundeck job') {
        steps {
        //   script {
        //     // step([$class: "RundeckNotifier",
        //     //       includeRundeckLogs: true,
        //     //       jobId: "a98fed62-3d7e-4668-9c5d-3a30bd9ec9ae",
        //     //       rundeckInstance: "rundeck-awsEC2",
        //     //       shouldFailTheBuild: true,
        //     //       shouldWaitForRundeckJob: true,
        //     //       tailLog: true])
        //   }
        echo "Rundeck here"
        }
    }
  }
  
}