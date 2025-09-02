/// <reference types="vite/client" />  
  
declare module "*.css" {  
  const content: Record<string, string>;  
  export default content;  
}  
  
declare module "virtual:pwa-register" {  
  export function registerSW(options?: {  
    onNeedRefresh?: () => void;  
    onOfflineReady?: () => void;  
  }): (reloadPage?: boolean) => Promise<void>;  
} 
