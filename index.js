/**
 *
 * @param {*} geojson
 * @param {*} coordinateCount per geojons coordinate count
 * @returns
 */
export function seg(geojson, coordinateCount = 5000) {
    if (isArray(geojson)) {
        return arraySeg(geojson.data || geojson.RECORDS || geojson, coordinateCount);
    }
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
            // if (count > coordinateCount) {
            //     console.warn(geojson.features[i], `is big ,coordinate count(${count}) >${coordinateCount}`);
            // }
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

function isArray(geojson) {
    return Array.isArray(geojson) || Array.isArray(geojson.data) || Array.isArray(geojson.RECORDS);
}

function arraySeg(data, coordinateCount) {
    const result = [], errorData = [];
    let features = [], totalCount = 0;
    for (let i = 0, len = data.length; i < len; i++) {
        const d = data[i];
        const { lnglat, lnglats, coordinates, fanwei, zuobiao, xy, xys, location } = (d || {});
        const ll = lnglats || lnglat || coordinates || fanwei || zuobiao || xy || xys || location;
        if (!ll || ll.indexOf(',') === -1 || !(typeof ll === 'string') || ll.indexOf('encode:') > -1) {
            errorData.push(d);
            continue;
        }
        let count = 0;
        if (ll.replaceAll) {
            const strLen = ll.length;
            const str = ll.replaceAll(',', '');
            count = strLen - str.length;
        } else {
            count = ll.split(',').length - 1;
        }
        if (ll.indexOf(';') === -1) {
            count /= 2;
        }
        d._coordinateCount = count;
        if (count >= coordinateCount) {
            result.push([d]);
            continue;
        }
        if (totalCount + count <= coordinateCount) {
            features.push(d);
            totalCount += count;
        } else {
            result.push(features);
            features = [d];
            totalCount = count;
        }
    }
    if (features.length) {
        result.push(features);
    }
    if (errorData.length) {
        result.push(errorData);
    }
    return result;
}

// const APPLICATION_JSON = { type: 'application/json' };
// const MB_SIZE = 1024 * 1024;

export function measureCoordianteCount(feature) {
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

function forEachRing(coordinates) {
    // multipoint,linestring
    if (!Array.isArray(coordinates[0][0])) {
        return coordinates.length;
    }
    // MultiLineString,Polyogn,MultiPolygon
    let count = 0;
    for (let i = 0, len = coordinates.length; i < len; i++) {
        count += forEachRing(coordinates[i]);
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
