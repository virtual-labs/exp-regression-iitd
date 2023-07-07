//javascript file for descriptive statistics experiments

function getData() {
    // extacting data points into an array from the string of Sample_1

    // extacting data points into an array from the string of Sample_1
    let dataString = document.getElementById("Sample_1").value;
    let freqString = document.getElementById("Sample_2").value;

    // removing extra space char at the bigginnig and end of inputed data
    dataString = dataString.trim();
    freqString = freqString.trim();

    // removing extra space in-between the data values in the data strings
    dataString = dataString.replace(/\s+/g, " ");
    freqString = freqString.replace(/\s+/g, " ");

    // defining a test to check whether the data in class data or not
    let classtest = /\d+[-]\d+/;

    // testing data string for classinput
    //if is is class data data we will return classdatafreq array if not we will return normal freqdataAray
    if (classtest.test(dataString)) {
        let dataArrayString = "";
        dataArrayString = dataString.split(" ");
        console.log(dataArrayString);
    }

    // making an num array from the string of point data
    let dataArray = dataString.split(" ");
    for (let x = 0; x < dataArray.length; x++) {
        dataArray[x] = +dataArray[x];
    }

    // making an num array from the string of freq data
    let freqArray = freqString.split(" ");
    for (let x = 0; x < freqArray.length; x++) {
        freqArray[x] = +freqArray[x];
    }

    let freqDataArray = [];

    if (freqArray.length !== dataArray.length) {
        alert("number of data and freqencies don't match");
    } else {
        freqDataArray.push(dataArray);
        freqDataArray.push(freqArray);
    }
    console.log(freqDataArray);
    return freqDataArray;
}


function getFlatData() {
    // extacting data points into an array from the string of Sample_1

    // extacting data points into an array from the string of Sample_1
    let dataString = document.getElementById("Sample_1").value;
    let freqString = document.getElementById("Sample_2").value;

    // removing extra space char at the bigginnig and end of inputed data
    dataString = dataString.trim();
    freqString = freqString.trim();

    // removing extra space in-between the data values in the data strings
    dataString = dataString.replace(/\s+/g, " ");
    freqString = freqString.replace(/\s+/g, " ");

    // defining a test to check whether the data in class data or not
    let classtest = /\d+[-]\d+/;

    // testing data string for classinput
    //if is is class data data we will return classdatafreq array if not we will return normal freqdataAray
    if (classtest.test(dataString)) {
        let dataArrayString = "";
        dataArrayString = dataString.split(" ");
        console.log(dataArrayString);
    }

    // making an num array from the string of point data
    let dataArray = dataString.split(" ");
    for (let x = 0; x < dataArray.length; x++) {
        dataArray[x] = +dataArray[x];
    }

    // making an num array from the string of freq data
    let freqArray = freqString.split(" ");
    for (let x = 0; x < freqArray.length; x++) {
        freqArray[x] = +freqArray[x];
    }

    let freqDataArray = [];

    if (freqArray.length !== dataArray.length) {
        alert("number of data and freqencies don't match");
    } else {

        for (let k = 0; k < dataArray.length; k++) {
            let tempArray = []
            for (let i = freqArray[k]; i > 0; i--) {
                tempArray.push(dataArray[k]);
            }
            // tempArray.push(freqArray[k]);
            freqDataArray.push(tempArray);
        }
    }

    freqDataArray = freqDataArray.flat();
    // console.log(freqDataArray)
    return freqDataArray;
}

//---------------------------------------------------------------------
// Start of all Charting Functions
//---------------------------------------------------------------------

// Start of Line Chart Plot funtion
google.charts.load("current", { packages: ["corechart"] });

function makeLineChart() {
    //getting data
    let mydata = getData();

    let tempdata = [];
    tempdata.push(mydata[0].map(String));
    tempdata.push(mydata[1]);


    mydata = tempdata;

    console.log(mydata)

    let data = new google.visualization.DataTable();
    data.addColumn("string", "X");
    data.addColumn("number", "Y");

    let rows = [];


    for (let i = 0; i < mydata[1].length; i++) {
        let tempArray = [];
        tempArray.push(mydata[0][i]);
        tempArray.push(mydata[1][i]);
        rows.push(tempArray);
    }


    data.addRows(rows)
        // Set Options
    var options = {
        title: "Line Chart",
        hAxis: { title: "X" },
        vAxis: { title: "Y" },
        legend: "none",
    };
    // Draw Chart
    var chart = new google.visualization.LineChart(
        document.getElementById("myChart")
    );
    chart.draw(data, options);
}
// End of Line Chart Plot funtion





//---------------------------------------------------------------------
// Start of Pie Chart plot function
function makePieChart() {
    let mydata = getData();

    let tempdata = [];
    tempdata.push(mydata[0].map(String));
    tempdata.push(mydata[1]);


    mydata = tempdata;

    console.log(mydata)

    let data = new google.visualization.DataTable();
    data.addColumn("string", "Data");
    data.addColumn("number", "Y");

    let rows = [];


    for (let i = 0; i < mydata[1].length; i++) {
        let tempArray = [];
        tempArray.push(mydata[0][i]);
        tempArray.push(mydata[1][i]);
        rows.push(tempArray);
    }


    data.addRows(rows)

    // Set Options
    var options = {
        title: "Pie Chart",
    };
    // Draw Chart
    var chart = new google.visualization.PieChart(
        document.getElementById("myChart")
    );
    chart.draw(data, options);
}
// End of Pie Chart plot function
//---------------------------------------------------------------------




// Start of Bar Chart plot function
function makeBarChart() {
    let mydata = getData();

    let tempdata = [];
    tempdata.push(mydata[0].map(String));
    tempdata.push(mydata[1]);


    mydata = tempdata;

    console.log(mydata)

    let data = new google.visualization.DataTable();
    data.addColumn("string", "Data");
    data.addColumn("number", "Y");

    let rows = [];


    for (let i = 0; i < mydata[1].length; i++) {
        let tempArray = [];
        tempArray.push(mydata[0][i]);
        tempArray.push(mydata[1][i]);
        rows.push(tempArray);
    }


    data.addRows(rows)
        // Set Options
    let options = {
        title: "Bar Chart",
    };
    // Draw Chart
    let chart = new google.visualization.BarChart(
        document.getElementById("myChart")
    );
    chart.draw(data, options);
}
// End of Bar graph plot function




//---------------------------------------------------------------------
// Start of scatter chart plot function
function makeScatterChart() {
    let mydata = getData();

    let tempdata = [];
    tempdata.push(mydata[0].map(String));
    tempdata.push(mydata[1]);


    mydata = tempdata;

    console.log(mydata)

    let data = new google.visualization.DataTable();
    data.addColumn("string", "X");
    data.addColumn("number", "Y");

    let rows = [];


    for (let i = 0; i < mydata[1].length; i++) {
        let tempArray = [];
        tempArray.push(mydata[0][i]);
        tempArray.push(mydata[1][i]);
        rows.push(tempArray);
    }


    data.addRows(rows)

    // Set Options
    var options = {
        title: "Scatter Plot",
    };
    // Draw Chart
    var chart = new google.visualization.ScatterChart(
        document.getElementById("myChart")
    );
    chart.draw(data, options);
}
// End of Scatter Chart graph plot function
//--------------------------------------------------------------------










// Start of Area chart plot function
function makeAreaChart() {
    let mydata = getData();

    let tempdata = [];
    tempdata.push(mydata[0].map(String));
    tempdata.push(mydata[1]);


    mydata = tempdata;

    console.log(mydata)

    let data = new google.visualization.DataTable();
    data.addColumn("string", "X");
    data.addColumn("number", "Y");

    let rows = [];


    for (let i = 0; i < mydata[1].length; i++) {
        let tempArray = [];
        tempArray.push(mydata[0][i]);
        tempArray.push(mydata[1][i]);
        rows.push(tempArray);
    }


    data.addRows(rows)
        // Set Options
    var options = {
        title: "Area Graph",
    };
    // Draw Chart
    var chart = new google.visualization.AreaChart(
        document.getElementById("myChart")
    );
    chart.draw(data, options);
}
// End of Scatter Chart graph plot function
//--------------------------------------------------------------------

google.charts.load("current", { packages: ["corechart"] });
// Start of Box-Whisker plot function
function makeBoxWhiskerChart() {
    let mydata = getData();
    console.log(mydata);


    let row = [];

    for (let k = 0; k < mydata[0].length; k++) {
        let tempArray = [];
        for (let i = mydata[1][k]; i > 0; i--) {
            tempArray.push(mydata[0][k]);
        }
        // tempArray.push(freqArray[k]);
        row.push(tempArray);
    }
    let data = google.visualization.arrayToDataTable([
        ["keshav", ...row.flat()]
    ], true);

    // Set Options
    let options = {
        title: "Box Whisker Plot",
    };


    // Draw Chart
    var chart = new google.visualization.CandlestickChart(
        document.getElementById("myChart")
    );
    chart.draw(data, options);
}
// End of box-whisker Chart graph plot function








//--------------------------------------------------------------------

// Start of Table plot code
google.charts.load("current", { packages: ["table"] });
// Start of Table plot function
function makeTableChart() {
    let mydata = getData();
    console.log(mydata);

    let data = new google.visualization.DataTable();
    data.addColumn("number", "X");
    data.addColumn("number", "Y");

    let rows = [];

    for (let i = 0; i < mydata[1].length; i++) {
        let tempArray = [];
        tempArray.push(mydata[0][i]);
        tempArray.push(mydata[1][i]);
        rows.push(tempArray);
    }
    console.log(rows);

    data.addRows(rows);

    // Set Options
    let options = {
        title: "Data Y Table",
        showRowNumber: true,
        alternatingRowStyle: true,
        explorer: { axis: "horizontal", keepInBounds: true },
    };
    // Draw Chart
    var chart = new google.visualization.Table(
        document.getElementById("myChart")
    );
    chart.draw(data, options);
}
// End of Table Chart graph plot function
//--------------------------------------------------------------------

//---------------------------------------------------------------------
// End of all Charting Functions
//---------------------------------------------------------------------