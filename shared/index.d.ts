declare module "#app" {
  interface NuxtApp {
    // $hello(msg: string): string;
    $db: IDBDatabase;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    // $hello(msg: string): string;

    $db: IDBDatabase;
  }
}

export {};
