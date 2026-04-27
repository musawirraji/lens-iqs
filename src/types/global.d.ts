// CSS module augmentation for SCSS modules.
declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.scss";
declare module "*.css";
