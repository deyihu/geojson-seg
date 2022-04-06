# geojson-seg
## CDN
```html
 <script type="text/javascript" src="https://unpkg.com/geojson-seg@0.0.4/dist/geojson-seg.min.js"></script>

 <script>

     fetch('./isoline.geojson').then(res=>res.json()).then(geojson=>{

          // the count of coordiante one geojson file
          const coordinateCount=12000;
          const geojsons=geojsonseg.seg(geojson,coordinateCount);
     })

</script>

```

## NPM
```shell
npm i geojson-seg
# or
yarn add geojson-seg
```

```js

  //ESM
  import {seg} from 'geojson-seg';

  // the count of coordiante one geojson file
  const coordinateCount=12000;
  const geojsons=seg(geojson,coordinateCount);


  //node
  const geojsonseg=require('geojson-seg');
  // the count of coordiante one geojson file
  const coordinateCount=12000;
  const geojsons=geojsonseg.seg(geojson,coordinateCount);

```