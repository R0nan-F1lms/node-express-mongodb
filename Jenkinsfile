pipeline {
  agent any

  environment {
    NODE_ENV  = 'test'
    APP_PORT  = '8080'
    MONGO_URL = 'mongodb://localhost:27017/bezkoder_db'
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'master', url: 'https://github.com/R0nan-F1lms/node-express-mongodb.git'
      }
    }

    stage('Build') {
      steps {
        echo 'Installing dependencies…'
        bat 'npm install'
      }
    }

    stage('Test') {
      steps {
        echo 'Running tests…'
        bat 'set NODE_ENV=test&& npx jest --runInBand --detectOpenHandles'
      }
    }

    stage('Code Quality') {
      steps {
        echo 'Running ESLint…'
        bat 'npm install --save-dev eslint @eslint/js globals'
        bat 'npx eslint . --max-warnings=10'
      }
    }

    stage('Security') {
      steps {
        echo 'Running Snyk security scan…'
        bat 'npm install snyk --save-dev'
        withCredentials([string(credentialsId: 'SNYK_TOKEN', variable: 'SNYK_TOKEN')]) {
          bat 'npx snyk auth %SNYK_TOKEN%'
        }
        bat 'npx snyk test'
      }

    stage('Deploy') {
      steps {
        echo 'Starting app…'
        bat 'taskkill /IM node.exe /F >NUL 2>&1 || exit /b 0'
        bat 'start "" /B node server.js'
        sleep(time: 8, unit: 'SECONDS')
      }
    }

    stage('Monitor') {
      steps {
        echo 'Checking endpoints…'
        bat 'curl -sS http://localhost:%APP_PORT%/ || (echo "Root check failed" && exit /b 1)'
        bat 'curl -sS http://localhost:%APP_PORT%/api/tutorials || (echo "API check failed" && exit /b 1)'
        bat 'curl -sS http://localhost:%APP_PORT%/health || (echo "Health check failed" && exit /b 1)'
      }
    }

    stage('Release') {
      steps {
        echo 'Tagging release…'
        bat 'git config user.email "ci@example.com"'
        bat 'git config user.name "CI Bot"'
        bat 'git tag -a v1.0.%BUILD_NUMBER% -m "Automated release %BUILD_NUMBER%"'
        bat 'git push origin v1.0.%BUILD_NUMBER% || echo "Tag push skipped (no creds)"'
      }
    }
  }

  post {
    always {
      echo 'Cleaning up…'
      bat 'taskkill /IM node.exe /F >NUL 2>&1 || exit /b 0'
    }
  }
}
