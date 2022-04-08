import * as d3 from 'd3';
import { nest } from 'd3-collection';

//dataRestyle]e
export const restyleData = (dataToProces) => {
    // console.log("data to process"+dataToProces)
    var newData = [];

    for (let item of dataToProces) {

        let holder = {};

        holder["type"] = "10";
        holder["yearMonth"] = item["yearMonth"];
        holder["value"] = item["expectedAmounts"]["10"];
        newData.push(holder);

        holder = {};
        holder["type"] = "50";
        holder["yearMonth"] = item["yearMonth"];
        holder["value"] = item["expectedAmounts"]["50"];
        newData.push(holder);

        holder = {};
        holder["type"] = "75";
        holder["yearMonth"] = item["yearMonth"];
        holder["value"] = item["expectedAmounts"]["75"];
        newData.push(holder);

        holder = {}
        holder["type"] = "totalDeposit";
        holder["yearMonth"] = item["yearMonth"];
        holder["value"] = item["totalDeposit"];
        newData.push(holder);

        holder = {};
        holder["type"] = "benchmark";
        holder["yearMonth"] = item["yearMonth"];
        holder["value"] = item["expectedAmounts"]["benchmark"];
        newData.push(holder);
    }

    return newData;

}

//grouped data
export const reGroupData = (processData) => {
    return nest()
        .key(d => d.type)
        .entries(processData);
}

//set up bisectData
export const bisectData = (d, xDate) => {

    var formatter = d3.timeFormat("%Y-%m");
    xDate = formatter(xDate);
    var bisect = d3.bisector(function (d) {
        return d.yearMonth;
    }).left
    var idx = bisect(d.values, xDate);
    return idx;
}

//set up color
export const setUpColors = (regroupedData) => {
    var typeName = regroupedData.map(d => d.key);
    var colour = d3.scaleOrdinal().domain(typeName).range(["#c2ff61", "#32a852", "#6b0a70", "#a84c32", "#03abff"]);
    return colour
}
