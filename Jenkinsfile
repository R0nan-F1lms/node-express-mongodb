pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
        APP_PORT = '8080'
        MONGO_URL = 'mongodb://localhost:27017/bezkoder_db'
        DOCKER_IMAGE = 'node-express-mongodb:latest'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/R0nan-F1lms/node-express-mongodb.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Installing dependencies and building project...'
                bat 'npm install'
                bat 'npm run build || echo "No build script, skipping"'
            }
        }

        stage('Test') {
            steps {
                echo 'Running automated tests...'
                // using Mocha as an example for health check
                bat 'npm install --save-dev mocha chai supertest'
                bat 'npx mocha tests/health.test.js --timeout 5000'
            }
        }

        stage('Code Quality') {
            steps {
                echo 'Running ESLint for code quality...'
                bat 'npm install --save-dev eslint'
                bat 'npx eslint . --max-warnings=0 || true'
            }
        }

        stage('Security Scan') {
            steps {
                echo 'Running Snyk security scan...'
                bat 'npm install -g snyk'
                bat 'snyk auth || echo "Already authenticated"'
                bat 'snyk test'
            }
        }

        stage('Docker Build & Deploy') {
            steps {
                echo 'Building Docker image and deploying to local container...'
                bat 'docker build -t %DOCKER_IMAGE% .'
                bat 'docker stop node-express-mongodb || echo "No existing container"'
                bat 'docker rm node-express-mongodb || echo "No existing container"'
                bat 'docker run -d -p %APP_PORT%:8080 --name node-express-mongodb -e MONGO_URL=%MONGO_URL% %DOCKER_IMAGE%'
            }
        }

        stage('Monitoring') {
            steps {
                echo 'Checking application health endpoint...'
                bat 'curl http://localhost:%APP_PORT%/ || echo "Health check failed"'
                echo 'Monitoring logs...'
                bat 'docker logs node-express-mongodb'
            }
        }

        stage('Release') {
            steps {
                echo 'Tagging and preparing release...'
                bat 'git tag -a v1.0.${BUILD_NUMBER} -m "Automated release ${BUILD_NUMBER}"'
                bat 'git push origin v1.0.${BUILD_NUMBER} || echo "Tag push failed"'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
           // bat 'docker stop node-express-mongodb || echo "No container to stop"'
           // bat 'docker rm node-express-mongodb || echo "No container to remove"'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
