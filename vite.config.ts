import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import obfuscator from 'rollup-plugin-obfuscator';
import babel from 'vite-plugin-babel';

dotenv.config();

export default defineConfig({
  plugins: [react(), babel()],
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
        // drop_debugger: true
      },
      mangle: true,
      output: {
        comments: false // Remove comments
      }
    },
    rollupOptions: {
      plugins: [
        obfuscator({
          options: {
            // optionsPreset: 'high-obfuscation', // or 'default', 'low-obfuscation'
            // compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            // debugProtection: true,
            // debugProtectionInterval: 3000,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            numbersToExpressions: true,
            renameGlobals: false,
            selfDefending: true,
            simplify: true,
            splitStrings: true,
            splitStringsChunkLength: 10,
            stringArray: true,
            stringArrayEncoding: ['rc4'],
            stringArrayThreshold: 0.75,
            unicodeEscapeSequence: false
          }
        })
      ]
    }
  },
  define: {
    'process.env': JSON.stringify(process.env) // Provide process.env to the client
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
