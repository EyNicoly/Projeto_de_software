import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente do .env no diretório raiz
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // Define a variável de ambiente para ser acessível no código do frontend
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    },
    // Configuração para o servidor de desenvolvimento
    server: {
      port: 3000,
    }
  };
});
