# geojson-seg

```html
 <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/geojson-seg@0.0.2/dist/geojson-seg.min.js"></script>

 <script>

     fetch('./isoline.geojson').then(res=>res.json()).then(geojson=>{

           const coordinateCount=12000;
          const geojsons=seg(geojson,coordinateCount);
     })

</script>

```

```js

  //ESM
  import {seg} from 'geojson-seg';

  const coordinateCount=12000;

  const geojsons=seg(geojson,coordinateCount);


  //node
  const geojsonseg=require('geojson-seg');
  const coordinateCount=12000;
  const geojsons=seg(geojson,coordinateCount);

```