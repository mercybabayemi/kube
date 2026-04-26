#!/bin/bash
# run_from: kube-frontend/
# Installs Jest + React Testing Library for Next.js 14

echo "Installing frontend test dependencies..."

npm install --save-dev \
  jest@^29.7.0 \
  jest-environment-jsdom@^29.7.0 \
  @testing-library/react@^14.3.1 \
  @testing-library/jest-dom@^6.4.6 \
  @testing-library/user-event@^14.5.2 \
  @types/jest@^29.5.12 \
  ts-jest@^29.2.4 \
  babel-jest@^29.7.0 \
  @babel/preset-env@^7.24.7 \
  @babel/preset-react@^7.24.7 \
  @babel/preset-typescript@^7.24.7
 

echo ""
echo "Done. Add these scripts to package.json:"
echo '  "test": "jest",'
echo '  "test:watch": "jest --watch",'
echo '  "test:coverage": "jest --coverage"'
echo ""
echo "File placement guide:"
echo "  jest.config.ts        → kube-frontend/jest.config.ts"
echo "  jest.setup.ts         → kube-frontend/jest.setup.ts"
echo "  api.test.ts           → kube-frontend/src/__tests__/lib/api.test.ts"
echo "  login.test.tsx        → kube-frontend/src/__tests__/app/auth/login.test.tsx"
echo ""
echo "Run tests with: npm test"
