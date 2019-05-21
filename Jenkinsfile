def notifyMessengers(String buildStatus = 'STARTED') {
    // Build status of null means successful.
    buildStatus = buildStatus ?: 'SUCCESS'
    // Replace encoded slashes.
    def decodedJobName = env.JOB_NAME.replaceAll("%2F", "/")

    def colorSlack

    if (buildStatus == 'STARTED') {
        colorSlack = '#D4DADF'
    } else if (buildStatus == 'SUCCESS') {
        colorSlack = '#BDFFC3'
    } else if (buildStatus == 'UNSTABLE') {
        colorSlack = '#FFFE89'
    } else {
        colorSlack = '#FF9FA1'
    }

    def msgSlack = "${buildStatus}: `${decodedJobName}` #${env.BUILD_NUMBER}: ${env.BUILD_URL}"
    
    slackSend(color: colorSlack, message: msgSlack)  
}


ansiColor('xterm') {
node('master') {
   try {
      notifyMessengers('STARTED')

      properties ([
            buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '10')),
            [$class: 'RebuildSettings', autoRebuild: false, rebuildDisabled: false],
            ])

         if("${BRANCH_NAME}" == "dev"){
            
            checkout scm
            
            stage("dev1 Version Info") {
               sh '''
               cd "${WORKSPACE}"
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               echo $PATH
               echo "Version Info"
               node --version
               npm --version
               '''
            }

            stage("dev1 Npm install") {
               sh '''
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               echo "Npm install"
               npm install node-sass
               npm install --ignore-scripts
               '''
            }

            stage("dev1 Building Frontend") {
               sh '''
               cd "${WORKSPACE}"
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               npm install ng
               echo "Building frontend"
               "${WORKSPACE}"/node_modules/@angular/cli/bin/ng build -c=dev
               '''
            }
            
            stage("dev1 Save Artifact") {
               sh '''
               echo "Upload Artifact"
               cd "${WORKSPACE}"
               now=$(date +"%d-%m-%y_%H-%M-%S")
               zip -r frontend.$now.zip dist node_modules e2e
               aws s3 cp frontend.$now.zip s3://mo-artifacts/bfa-frontend/dev1/frontend.$now.zip
               aws s3 cp frontend.$now.zip s3://mo-artifacts/bfa-frontend/dev1/latest/frontend.zip
               '''
            }

            stage("dev1 Artifact Deploy") {
               sh '''
               echo "Deploy Artifact"
               '''
            }
         }
         else if ("${BRANCH_NAME}" == "dev2") {
            checkout scm
            
            stage("dev2 Version Info") {
               sh '''
               cd "${WORKSPACE}"
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               echo $PATH
               echo "Version Info"
               node --version
               npm --version
               '''
            }

            stage("dev2 Npm install") {
               sh '''
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               echo "Npm install"
               npm install node-sass
               npm install --ignore-scripts
               '''
            }

            stage("dev2 Building Frontend") {
               sh '''
               cd "${WORKSPACE}"
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               npm install ng
               echo "Building frontend"
               "${WORKSPACE}"/node_modules/@angular/cli/bin/ng build -c=dev
               '''
            }
            
            stage("dev2 Save Artifact") {
               sh '''
               echo "Upload Artifact"
               cd "${WORKSPACE}"
               now=$(date +"%d-%m-%y_%H-%M-%S")
               zip -r frontend.$now.zip dist node_modules e2e
               aws s3 cp frontend.$now.zip s3://mo-artifacts/bfa-frontend/dev2/frontend.$now.zip
               aws s3 cp frontend.$now.zip s3://mo-artifacts/bfa-frontend/dev2/latest/frontend.zip
               '''
            }

            stage("dev2 Artifact Deploy") {
               sh '''
               echo "Deploy Artifact"
               '''
            }
         }
         else if ("${BRANCH_NAME}" == "uat") {
            checkout scm
            
            stage("uat1 Version Info") {
               sh '''
               cd "${WORKSPACE}"
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               echo $PATH
               echo "Version Info"
               node --version
               npm --version
               '''
            }

            stage("uat1 Npm install") {
               sh '''
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               echo "Npm install"
               npm install node-sass
               npm install --ignore-scripts
               '''
            }

            stage("uat1 Building Frontend") {
               sh '''
               cd "${WORKSPACE}"
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               npm install ng
               echo "Building frontend"
               "${WORKSPACE}"/node_modules/@angular/cli/bin/ng build -c=uat
               '''
            }
            
            stage("uat1 Save Artifact") {
               sh '''
               echo "Upload Artifact"
               cd "${WORKSPACE}"
               now=$(date +"%d-%m-%y_%H-%M-%S")
               zip -r frontend.$now.zip dist node_modules e2e
               aws s3 cp frontend.$now.zip s3://mo-artifacts/bfa-frontend/uat1/frontend.$now.zip
               aws s3 cp frontend.$now.zip s3://mo-artifacts/bfa-frontend/uat1/latest/frontend.zip
               '''
            }

            stage("uat1 Artifact Deploy") {
               sh '''
               echo "Deploy Artifact"
               '''
            }
         }
         else if ("${BRANCH_NAME}" == "uat2") {
            checkout scm
            
            stage("uat2 Version Info") {
               sh '''
               cd "${WORKSPACE}"
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               echo $PATH
               echo "Version Info"
               node --version
               npm --version
               '''
            }

            stage("uat2 Npm install") {
               sh '''
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               echo "Npm install"
               npm install node-sass
               npm install --ignore-scripts
               '''
            }

            stage("uat2 Building Frontend") {
               sh '''
               cd "${WORKSPACE}"
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               npm install ng
               echo "Building frontend"
               "${WORKSPACE}"/node_modules/@angular/cli/bin/ng build -c=uat
               '''
            }
            
            stage("uat2 Save Artifact") {
               sh '''
               echo "Upload Artifact"
               cd "${WORKSPACE}"
               now=$(date +"%d-%m-%y_%H-%M-%S")
               zip -r frontend.$now.zip dist node_modules e2e
               aws s3 cp frontend.$now.zip s3://mo-artifacts/bfa-frontend/uat2/frontend.$now.zip
               aws s3 cp frontend.$now.zip s3://mo-artifacts/bfa-frontend/uat2/latest/frontend.zip
               '''
            }

            stage("uat2 Artifact Deploy") {
               sh '''
               echo "Deploy Artifact"
               '''
            }
         }
         else if ("${BRANCH_NAME}" == "uat3") {
            checkout scm
            
            stage("uat3 Version Info") {
               sh '''
               cd "${WORKSPACE}"
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               echo $PATH
               echo "Version Info"
               node --version
               npm --version
               '''
            }

            stage("uat3 Npm install") {
               sh '''
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               echo "Npm install"
               npm install node-sass
               npm install --ignore-scripts
               '''
            }

            stage("uat3 Building Frontend") {
               sh '''
               cd "${WORKSPACE}"
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               npm install ng
               echo "Building frontend"
               "${WORKSPACE}"/node_modules/@angular/cli/bin/ng build -c=uat
               '''
            }
            
            stage("uat3 Save Artifact") {
               sh '''
               echo "Upload Artifact"
               cd "${WORKSPACE}"
               now=$(date +"%d-%m-%y_%H-%M-%S")
               zip -r frontend.$now.zip dist node_modules e2e
               aws s3 cp frontend.$now.zip s3://mo-artifacts/bfa-frontend/uat3/frontend.$now.zip
               aws s3 cp frontend.$now.zip s3://mo-artifacts/bfa-frontend/uat3/latest/frontend.zip
               '''
            }

            stage("uat3 Artifact Deploy") {
               sh '''
               echo "Deploy Artifact"
               '''
            }
         }
         else if ("${BRANCH_NAME}" == "dev-life") {
            checkout scm
            
            stage("Fb-dev Version Info") {
               sh '''
               cd "${WORKSPACE}"
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               echo $PATH
               echo "Version Info"
               node --version
               npm --version
               '''
            }

            stage("Fb-dev Npm install") {
               sh '''
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               echo "Npm install"
               npm install node-sass
               npm install --ignore-scripts
               '''
            }

            stage("Fb-dev Building Frontend") {
               sh '''
               cd "${WORKSPACE}"
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               echo "Building frontend"
               npm run deploy-serve:dev
               '''
            }
            
            stage("Fb-dev Save Artifact") {
               sh '''
               echo "Upload Artifact"
               cd "${WORKSPACE}"
               now=$(date +"%d-%m-%y_%H-%M-%S")
               zip -r frontend.$now.zip dist node_modules e2e
               aws s3 cp frontend.$now.zip s3://mo-artifacts/fb-frontend/dev1/frontend.$now.zip
               aws s3 cp frontend.$now.zip s3://mo-artifacts/fb-frontend/dev1/latest/frontend.zip
               '''
            }

            stage("Fb-dev Artifact Deploy") {
               sh '''
               echo "Deploy Artifact"
               '''
            }
         }
         else if ("${BRANCH_NAME}" == "uat-life") {
            checkout scm
            
            stage("Fb-uat Version Info") {
               sh '''
               cd "${WORKSPACE}"
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               echo $PATH
               echo "Version Info"
               node --version
               npm --version
               '''
            }

            stage("Fb-uat Npm install") {
               sh '''
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               echo "Npm install"
               npm install node-sass
               npm install --ignore-scripts
               '''
            }

            stage("Fb-uat Building Frontend") {
               sh '''
               cd "${WORKSPACE}"
               export PATH=/var/lib/jenkins/.nvm/versions/node/v8.9.3/bin:$PATH
               echo "Building frontend"
               npm run deploy-serve:uat
               '''
            }
            
            stage("Fb-uat Save Artifact") {
               sh '''
               echo "Upload Artifact"
               cd "${WORKSPACE}"
               now=$(date +"%d-%m-%y_%H-%M-%S")
               zip -r frontend.$now.zip dist node_modules e2e
               aws s3 cp frontend.$now.zip s3://mo-artifacts/fb-frontend/uat1/frontend.$now.zip
               aws s3 cp frontend.$now.zip s3://mo-artifacts/fb-frontend/uat1/latest/frontend.zip
               '''
            }

            stage("Fb-uat Artifact Deploy") {
               sh '''
               echo "Deploy Artifact"
               '''
            }
         }
         else {
            stage("figure out branch") {
               echo "This is ....." + "${BRANCH_NAME}"
            }
         } 

     cleanWs(
           cleanWhenAborted: true,
           cleanWhenFailure: true,
           cleanWhenNotBuilt: true,
           cleanWhenSuccess: true,
           cleanWhenUnstable: true,
           deleteDirs: true
       )
   }
   catch (e) {
      currentBuild.result = "FAILED"
	    throw e
   }
   finally {
      notifyMessengers(currentBuild.result)
   }
       
}
}

