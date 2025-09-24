pipeline {
  agent any

  environment {
    // Test mode for Jest so server.js doesn’t start listening
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

    stage('Install (Build artefact)') {
      steps {
        echo 'Installing dependencies…'
        bat 'npm install'
        // Create a tarball artefact of the project
        bat 'npm pack'
      }
    }

    stage('Test') {
      steps {
        echo 'Running Jest tests…'
        bat 'set NODE_ENV=test&& npx jest --runInBand --detectOpenHandles'
      }
    }

    stage('Code Quality (ESLint)') {
      steps {
        echo 'Linting with ESLint…'
        bat 'npm install --save-dev eslint @eslint/js globals'
        // Allow up to 10 warnings, fail if exceeded
        bat 'npx eslint . --max-warnings=10'
      }
    }

    stage('Security (npm audit)') {
      steps {
        echo 'Running npm audit (dependency vulnerabilities)…'
        bat 'npm audit --audit-level=moderate'
      }
    }

    stage('Verify MongoDB') {
      steps {
        echo 'Checking MongoDB connection...'
        bat 'mongo --eval "db.stats()" || echo "Mongo not reachable"'
      }
    }

    stage('Deploy to Test (local)') {
      steps {
        echo 'Starting app locally (background)…'
        // Kill any stray node processes
        bat 'taskkill /IM node.exe /F >NUL 2>&1 || exit /b 0'
        // Start app in background
        bat 'start "" /B node server.js'
        sleep(time: 8, unit: 'SECONDS')
      }
    }

    stage('Monitoring (smoke checks)') {
      steps {
        echo 'Checking HTTP endpoints…'
        // Check your three key endpoints
        bat 'curl -sS http://localhost:%APP_PORT%/ || (echo "Root check failed" && exit /b 1)'
        bat 'curl -sS http://localhost:%APP_PORT%/api/tutorials || (echo "API list check failed" && exit /b 1)'
        bat 'curl -sS http://localhost:%APP_PORT%/health || (echo "Health check failed" && exit /b 1)'
      }
    }

    stage('Stop Test App') {
      steps {
        echo 'Stopping local test app…'
        bat 'taskkill /IM node.exe /F >NUL 2>&1 || echo No node process to kill'
      }
    }

    stage('Release (tag)') {
      steps {
        echo 'Tagging build…'
        bat 'git config user.email "ci@example.com"'
        bat 'git config user.name "CI Bot"'
        bat 'git tag -a v1.0.%BUILD_NUMBER% -m "Automated release %BUILD_NUMBER%"'
        bat 'git push origin v1.0.%BUILD_NUMBER% || echo "Tag push skipped (no creds)"'
      }
    }
  }

  post {
    always {
      echo 'Cleanup…'
      // Safety net
      bat 'taskkill /IM node.exe /F >NUL 2>&1 || exit /b 0'
    }
    success { echo 'Pipeline succeeded.' }
    failure { echo 'Pipeline failed.' }
  }
}
