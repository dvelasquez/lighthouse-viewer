# ngx-lighthouse-viewer

This component is a angular wrapper for the lighthouse-viewer. 
It depends on [lighthouse-viewer](../lighthouse-viewer), package that exports the original lighthouse-viewer from Google
as an ES modules package.


## Getting started

1. Install using `npm install ngx-lighthouse-viewer` or `yarn add ngx-lighthouse-viewer`
2. Import `NgxLighthouseViewerModule`.

```ts
// ...
import { NgxLighthouseViewerModule } from 'ngx-lighthouse-viewer';


@NgModule({
  // ...
  imports: [
    // ...
    NgxLighthouseViewerModule
  ],
})
export class AppModule { }
```
3. Use component

```html
<ngx-lighthouse-viewer [json]="data"></ngx-lighthouse-viewer>
```

