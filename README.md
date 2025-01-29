# Vue 3 Starter Template

[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/eghamat24/vue3-starter-template/blob/main/README.md)
[![fa](https://img.shields.io/badge/lang-fa-red.svg)](https://github.com/eghamat24/vue3-starter-template/blob/main/README.fa.md)

## **Why Was This Project Created?**

This starter kit was created to speed up the initialization of new Vue projects and maintain a consistent development standard across different teams and projects. By following this standard, the maintenance and compatibility of projects became easier.

## **Challenges with Using UI Frameworks**

Using UI frameworks provides many components and speeds up development. However, they may introduce challenges such as slow components, limited customizability, and unnecessary features. This starter kit addresses these issues by providing lightweight and customizable components.

## **Key Features of the Starter Kit**

- Quick project setup with pre-configured store, services, and components
- Easy customization of component styles
- Improved project speed
- Built-in project tools and services following a consistent development standard

This template should help get you started developing with Vue 3 in Vite.

## **Folder Structure**

`📂starter kit`  
`├──📂 src`  
`│   ├──📂 asset`  
`│   ├──📂 components`  
`│   ├──📂 composables`  
`│   ├──📂 directives`  
`│   ├──📂 enums`  
`│   ├──📂 locales`   
`│   ├──📂 router`  
`│   ├──📂 services`   
`│   ├──📂 stores`  
`│   ├──📂 utils`  
`│   ├──📂 views`  
`│   ├──📄 app.vue`  
`│   ├──📄 bootstrap.js`  
`│   └──📄 main.js`  
`├──📄 vite.config.js`  
`├──📄 package.json`  
`└──🌐 index.html`



## **Included Components and Their Features**

- **VForm:** Provides validation for form fields.
- **VInput:** Custom input component with validation and customizable slots.
- **VAutoComplete:** Supports items and validation.
- **VRadioGroup:** Groups radio inputs with validation support.
- **VRadio:** Custom radio input with styling options.
- **VTextArea:** Custom text area component with validation.
- **VTooltip:** Tooltip component with customization options.
- **VModal:** Highly customizable modal component.
- **VTable & VTableServer:** Static and server-side table components.

## **Packages Used**

- Vite (v4.3)
- Pinia for state management
- Vue-router (v4)
- Vue-i18n for multilingual support
- Bootstrap (v5) for default styles
- Axios for service requests
- Rtlcss for managing right-to-left styles

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
