declare namespace NodeJS {
  interface Process {
    env: {
      NODE_ENV: 'development' | 'production' | 'test';
      // Add other environment variables you use
    }
  }
  
  var process: Process;
}