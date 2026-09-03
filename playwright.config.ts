import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  steps: 'tests/steps/**/*.ts',
});

export default defineConfig({
  testDir,
  
  /* Roda os testes dentro do mesmo arquivo de forma paralela */
  fullyParallel: true,
  
  /* Falha a build no CI se houver `.only` no código */
  forbidOnly: !!process.env.CI,
  
  /* Utiliza 50% dos núcleos localmente e apenas 1 worker no CI para estabilidade */
  workers: process.env.CI ? 1 : undefined,
  
  /* Zero retries localmente para poupar tempo (fast feedback) */
  retries: process.env.CI ? 2 : 0,
  
  reporter: 'html',
  
  use: {
    baseURL: 'https://www.pagbrasil.com/pt-br/',
    viewport: { width: 1920, height: 1080 },
    
    /* Configurações para acelerar a inicialização do navegador */
    bypassCSP: true,
    ignoreHTTPSErrors: true,
    
    // Evidências de testes (Screenshots, Traces e Vídeos)
    screenshot: 'only-on-failure', 
    video: 'retain-on-failure',    
    trace: 'retain-on-failure',    
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
});
