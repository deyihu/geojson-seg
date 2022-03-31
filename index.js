/**
 *
 * @param {*} geojson
 * @param {*} coordinateCount per geojons coordinate count
 * @returns
 */
export function seg(geojson, coordinateCount = 5000) {
    if (!geojson || !geojson.features || geojson.features.length === 0) {
        return [];
    }
    const geojsons = [];
    let totalCount = 0;
    let features = [];
    for (let i = 0, len = geojson.features.length; i < len; i++) {
        const count = measureCoordianteCount(geojson.features[i]);
        if (count >= coordinateCount) {
            geojsons.push(getGeoJSON([geojson.features[i]], count));
            if (count > coordinateCount) {
                console.warn(geojson.features[i], `is big ,coordinate count(${count}) >${coordinateCount}`);
            }
            continue;
        }
        if (count + totalCount <= coordinateCount) {
            features.push(geojson.features[i]);
            totalCount += count;
        } else {
            geojsons.push(getGeoJSON(features, totalCount));
            features = [geojson.features[i]];
            totalCount = count;
        }
    }
    if (features.length) {
        geojsons.push(getGeoJSON(features, totalCount));
    }
    return geojsons;
}

// const APPLICATION_JSON = { type: 'application/json' };
// const MB_SIZE = 1024 * 1024;

function measureCoordianteCount(feature) {
    if (feature.geometry && feature.geometry.coordinates && Array.isArray(feature.geometry.coordinates)) {
        const { coordinates } = feature.geometry;
        if (Array.isArray(coordinates[0])) {
            return forEachRing(coordinates);
        }
        // point
        return 1;
    }
    return 0;
}

function forEachRing(coorindates) {
    // multipoint,linestring
    if (!Array.isArray(coorindates[0][0])) {
        return coorindates.length;
    }
    // MultiLineString,Polyogn,MultiPolygon
    let count = 0;
    for (let i = 0, len = coorindates.length; i < len; i++) {
        count += forEachRing(coorindates[i]);
    }
    return count;
}

function getGeoJSON(features, coordinateCount) {
    return {
        type: 'FeatureCollection',
        features,
        coordinateCount
    };
}
