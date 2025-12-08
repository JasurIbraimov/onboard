// electron.d.ts (можно положить рядом с src/)
export {};

declare global {
  interface Window {
    electronAPI: {
      generateDoc: (data: any) => Promise<string>;
    };
  }
}
