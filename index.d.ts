// This should not be necssary :( But without the explict type definitions
// `@octoherd/octokit` exports the Class type instead of the instance type,
// and using "InstanceType<import('@octoherd/octokit').Octokit>" does not
// include the types from the plugins (octokit.paginate)
//
// The code is based on the generated type definitions from @octokit/rest:
// https://unpkg.com/browse/@octokit/rest/dist-types/index.d.ts
import { Octokit as Core } from "@octokit/core";

interface octoherdLog {
  (
    meta: Record<string, unknown>,
    message?: string,
    ...interpolations: string[]
  ): void;

  (message: string, ...interpolations: string[]): void;
}

interface octoherdLogSetContext {
  (meta: Record<string, unknown>): void;
}

export declare const Octokit: (new (...args: any[]) => {
  [x: string]: any;
}) & {
  new (...args: any[]): {
    [x: string]: any;
  };
  plugins: any[];
} & typeof Core &
  import("@octokit/core/types").Constructor<
    void & {
      paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
    } & {
      log: {
        debug: octoherdLog;
        info: octoherdLog;
        warn: octoherdLog;
        error: octoherdLog;
        setContext: octoherdLogSetContext;
      };
    }
  >;
export declare type Octokit = InstanceType<typeof Octokit>;

export declare type VERSION = string;
