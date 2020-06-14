/* eslint-disable */
declare module "*.svelte" {
  interface ComponentOptions<Props> {
    target: HTMLElement;
    anchor?: HTMLElement;
    props?: Props;
    hydrate?: boolean;
    intro?: boolean;
  }

  interface Component<Props> {
    new (options: ComponentOptions<Props>): any;
    $set: (props: {}) => any;
    $on: (event: string, callback: (event: CustomEvent) => any) => any;
    $destroy: () => any;
    render: (props?: {}) => {
      html: string;
      css: { code: string; map?: string };
      head?: string;
    };
  }

  const component: Component<{}>;

  export default component;
}

declare module '*.html' {
  const value: string;
  export default value;
}
