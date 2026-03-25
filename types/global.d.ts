// Tipos temporários para resolver erros do TypeScript

declare module 'react' {
  export * from 'react';
}

declare module 'react-dom' {
  export * from 'react-dom';
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

// Tipos básicos para bibliotecas ausentes
declare module 'estree' {
  export interface Node {
    type: string;
  }
}

declare module 'json-schema' {
  export interface Schema {
    type?: string;
    properties?: any;
  }
}

declare module 'json5' {
  export function parse(text: string): any;
  export function stringify(value: any): string;
}

declare module 'parse-json' {
  export default function parseJson(input: string): any;
}

declare module 'prop-types' {
  export const any: any;
  export const string: any;
  export const number: any;
  export const bool: any;
  export const object: any;
  export const array: any;
  export const func: any;
}

declare module 'react-transition-group' {
  export const CSSTransition: any;
  export const TransitionGroup: any;
  export const Transition: any;
}

// Tipos do Node.js
declare namespace NodeJS {
  export interface ProcessEnv {
    [key: string]: string | undefined;
  }
  
  export interface Process {
    env: ProcessEnv;
  }
}

declare const process: NodeJS.Process;