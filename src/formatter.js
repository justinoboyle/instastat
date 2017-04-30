import json2csv from 'json2csv';

export default async function(data, format) {
    if(format == "json")
        return JSON.stringify(data);
    return json2csv({ data, fields: Object.keys(data[0]) });
}