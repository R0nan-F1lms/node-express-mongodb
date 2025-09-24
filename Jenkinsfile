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
        git branch: 'master',
        url: 'https://github.com/R0nan-F1lms/node-express-mongodb.git',
        credentialsId: 'GITHUB_CREDENTIALS'
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
    }

    stage('Deploy') {
      steps {
        echo 'Building and starting app with Docker Compose…'
        bat 'docker compose -f docker-compose.yml down || exit /b 0'
        bat 'docker system prune -af || exit /b 0'   // clean up caches/layers
        bat 'docker compose -f docker-compose.yml build --no-cache'
        bat 'docker compose -f docker-compose.yml up -d'
      }
    }


    stage('Monitor') {
      steps {
        echo 'Checking endpoints…'
        // Wait until Mongo is reachable
        bat 'for /l %i in (1,1,10) do (curl -s http://localhost:27017 || (echo waiting & timeout /t 2 >nul))'
        // Now test endpoints
        bat 'curl -sS http://localhost:%APP_PORT%/ || (echo "Root check failed" && exit /b 1)'
        bat 'curl -sS http://localhost:%APP_PORT%/api/tutorials || (echo "API check failed" && exit /b 1)'
        bat 'curl -sS http://localhost:%APP_PORT%/health || (echo "Health check failed" && exit /b 1)'
      }
    }


    stage('Release') {
      steps {
        withCredentials([string(credentialsId: 'GITHUB_TOKEN', variable: 'GITHUB_TOKEN')]) {
          bat '''
            git config user.email "ci@example.com"
            git config user.name "CI Bot"
            git tag -a v1.0.%BUILD_NUMBER% -m "Automated release %BUILD_NUMBER%"
            git push origin master --tags

            curl -H "Authorization: token %GITHUB_TOKEN%" ^
                -H "Content-Type: application/json" ^
                -d "{\\"tag_name\\": \\"v1.0.%BUILD_NUMBER%\\", \\"target_commitish\\": \\"master\\", \\"name\\": \\"Release v1.0.%BUILD_NUMBER%\\", \\"body\\": \\"Automated release created by Jenkins\\", \\"draft\\": false, \\"prerelease\\": false}" ^
                https://api.github.com/repos/R0nan-F1lms/node-express-mongodb/releases
          '''
        }
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
