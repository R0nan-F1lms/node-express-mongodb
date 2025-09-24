pipeline {
  agent any

  environment {
    // Ensure server.js doesn’t call app.listen() during Jest
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
        bat 'if exist package-lock.json (npm ci) else (npm install)'
        echo 'Packing artefact…'
        bat 'npm pack'
        // keep a copy of the artefact in Jenkins for the report
        archiveArtifacts artifacts: '*.tgz', fingerprint: true
      }
    }

    stage('Test') {
      steps {
        echo 'Running Jest tests…'
        // test mode so server doesn’t listen; run in band to avoid open handles
        bat 'set NODE_ENV=test&& npx jest --runInBand --detectOpenHandles'
      }
    }

    stage('Code Quality (ESLint)') {
      steps {
        echo 'Linting with ESLint…'
        // install if not already present on the agent; harmless if already cached
        bat 'npm install --save-dev eslint @eslint/js globals'
        // fail on any warnings to keep the gate strict
        bat 'npx eslint . --max-warnings=0'
      }
    }

    stage('Security (npm audit)') {
      steps {
        echo 'Running npm audit (dependency vulnerabilities)…'
        bat 'npm audit --audit-level=moderate'
      }
    }

    stage('Deploy to Test (local)') {
      steps {
        echo 'Starting app locally (background)…'
        // best-effort cleanup of any stray Node processes from prior runs
        bat 'taskkill /IM node.exe /F >NUL 2>&1 || exit /b 0'
        // run server in background for smoke checks
        bat 'set NODE_ENV=development&& start "" /B node server.js'
        sleep(time: 8, unit: 'SECONDS')
      }
    }

    stage('Monitoring (smoke checks)') {
      steps {
        echo 'Checking HTTP endpoints…'
        // use endpoints that already exist in your clone
        bat 'curl -sS http://localhost:%APP_PORT%/ || (echo "Root check failed" && exit /b 1)'
        bat 'curl -sS http://localhost:%APP_PORT%/api/tutorials || (echo "API list check failed" && exit /b 1)'
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
        // Will only push if the job has push creds configured
        bat 'git push origin v1.0.%BUILD_NUMBER% || echo "Tag push skipped (no creds)"'
      }
    }
  }

  post {
    always {
      echo 'Cleanup…'
      bat 'taskkill /IM node.exe /F >NUL 2>&1 || exit /b 0'
    }
    success { echo 'Pipeline succeeded.' }
    failure { echo 'Pipeline failed.' }
  }
}
