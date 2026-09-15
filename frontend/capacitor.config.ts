import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.lucroplus.app',
  appName: 'LucroPlus',
  // Vite gera a build web em dist/ — o Capacitor empacota esse conteúdo no app nativo.
  webDir: 'dist',
};

export default config;
