function cwdFormat(path: `/${string}`): string {
  const cwd = Deno.cwd().replace("\\", "/");

  return cwd + path;
}
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
type Config = {
  paths: {
    views: string;
    partials: string;
    resources: string;
    migrations: string;
  };
};
async function getConfig(): Promise<Config> {
  const configFolder = Deno.cwd() + "/config/";
  const config: DeepPartial<Config> = {};
  for await (const file of Deno.readDir(configFolder)) {
    const filePath = configFolder + file.name;
    switch (file.name) {
      case "paths.json":
        config.paths = JSON.parse(await Deno.readTextFile(filePath));
    }
  }
  config.paths ??= {};
  {
    config.paths.views ??= cwdFormat("/app/views/");
    config.paths.partials ??= cwdFormat("/app/partials/");
    config.paths.resources ??= cwdFormat("/db/");
    config.paths.resources ??= cwdFormat("/pub/");
  }
  return config as Config;
}
const config = await getConfig();
export default config;
