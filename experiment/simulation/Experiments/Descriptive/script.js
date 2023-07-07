//javascript file for descriptive statistics experiments



function createSampleInputs() {
    const numSamples = parseInt(document.getElementById('numSamples').value);
    const sampleInputContainer = document.getElementById('sampleInputContainer');
    const sampleSelectionContainer = document.getElementById('sampleSelectionContainer');

    sampleInputContainer.innerHTML = '';
    sampleSelectionContainer.innerHTML = '';

    for (let i = 1; i <= numSamples; i++) {
        const label = document.createElement('label');
        label.htmlFor = `Sample_${i}`;
        label.textContent = `Sample ${i}: `;

        const input = document.createElement('input');
        input.type = 'text'; // Change the input type to 'text'
        input.id = `Sample_${i}`;
        input.name = `Sample_${i}`;
        input.placeholder = `Enter values for Sample ${i} with space in between`;
        input.classList.add('sample-input');

        sampleInputContainer.appendChild(label);
        sampleInputContainer.appendChild(input);
        sampleInputContainer.appendChild(document.createElement('br'));

        // Create checkbox for sample selection
        const checkboxLabel = document.createElement('label');
        checkboxLabel.htmlFor = `Checkbox_${i}`;
        checkboxLabel.textContent = `Sample ${i} `;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `Checkbox_${i}`;
        checkbox.name = `Checkbox_${i}`;
        checkbox.value = `Sample_${i}`;

        sampleSelectionContainer.appendChild(checkboxLabel);
        sampleSelectionContainer.appendChild(checkbox);
        sampleSelectionContainer.appendChild(document.createElement('br'));
    }

    document.getElementById("regressionButton").style.display = numSamples >= 2 ? "block" : "none";

    // Function to get the data from the input fields
}

function getData() {
    const numSamples = parseInt(document.getElementById('numSamples').value);
    const data2DArray = [];

    for (let i = 1; i <= numSamples; i++) {
        const inputId = `Sample_${i}`;
        let dataString = document.getElementById(inputId).value.trim();
        dataString = dataString.replace(/\s+/g, " ");

        const dataArray = dataString.split(/\s+/).map(Number);
        data2DArray.push(dataArray);
    }

    console.log(data2DArray);
    return data2DArray;
}

// function getData() {
//     // extacting data points into an array from the string of Sample_1

//     // extacting data points into an array from the string of Sample_1
//     let dataString = document.getElementById("Sample_1").value;
//     let freqString = document.getElementById("Sample_2").value;

//     // removing extra space char at the bigginnig and end of inputed data
//     dataString = dataString.trim();
//     freqString = freqString.trim();

//     // removing extra space in-between the data values in the data strings
//     dataString = dataString.replace(/\s+/g, " ");
//     freqString = freqString.replace(/\s+/g, " ");

//     // defining a test to check whether the data in class data or not
//     let classtest = /\d+[-]\d+/;

//     // testing data string for classinput
//     //if is is class data data we will return classdatafreq array if not we will return normal freqdataAray
//     if (classtest.test(dataString)) {
//         let dataArrayString = "";
//         dataArrayString = dataString.split(" ");
//         console.log(dataArrayString);
//     }

//     // making an num array from the string of point data
//     let dataArray = dataString.split(" ");
//     for (let x = 0; x < dataArray.length; x++) {
//         dataArray[x] = +dataArray[x];
//     }

//     // making an num array from the string of freq data
//     let freqArray = freqString.split(" ");
//     for (let x = 0; x < freqArray.length; x++) {
//         freqArray[x] = +freqArray[x];
//     }

//     let freqDataArray = [];

//     if (freqArray.length !== dataArray.length) {
//         alert("number of data and freqencies don't match");
//     } else {
//         freqDataArray.push(dataArray);
//         freqDataArray.push(freqArray);
//     }
//     console.log(freqDataArray);
//     return freqDataArray;
// }


// // function getFlatData() {
// //     // extacting data points into an array from the string of Sample_1

// //     // extacting data points into an array from the string of Sample_1
// //     let dataString = document.getElementById("Sample_1").value;
// //     let freqString = document.getElementById("Sample_2").value;

// //     // removing extra space char at the bigginnig and end of inputed data
// //     dataString = dataString.trim();
// //     freqString = freqString.trim();

// //     // removing extra space in-between the data values in the data strings
// //     dataString = dataString.replace(/\s+/g, " ");
// //     freqString = freqString.replace(/\s+/g, " ");

// //     // defining a test to check whether the data in class data or not
// //     let classtest = /\d+[-]\d+/;

// //     // testing data string for classinput
// //     //if is is class data data we will return classdatafreq array if not we will return normal freqdataAray
// //     if (classtest.test(dataString)) {
// //         let dataArrayString = "";
// //         dataArrayString = dataString.split(" ");
// //         console.log(dataArrayString);
// //     }

// //     // making an num array from the string of point data
// //     let dataArray = dataString.split(" ");
// //     for (let x = 0; x < dataArray.length; x++) {
// //         dataArray[x] = +dataArray[x];
// //     }

// //     // making an num array from the string of freq data
// //     let freqArray = freqString.split(" ");
// //     for (let x = 0; x < freqArray.length; x++) {
// //         freqArray[x] = +freqArray[x];
// //     }

// //     let freqDataArray = [];

// //     if (freqArray.length !== dataArray.length) {
// //         alert("number of data and freqencies don't match");
// //     } else {

// //         for (let k = 0; k < dataArray.length; k++) {
// //             let tempArray = []
// //             for (let i = freqArray[k]; i > 0; i--) {
// //                 tempArray.push(dataArray[k]);
// //             }
// //             // tempArray.push(freqArray[k]);
// //             freqDataArray.push(tempArray);
// //         }
// //     }

// //     freqDataArray = freqDataArray.flat();
// //     // console.log(freqDataArray)
// //     return freqDataArray;
// // }

//---------------------------------------------------------------------
// Start of all Charting Functions
//---------------------------------------------------------------------

// Start of Line Chart Plot funtion


google.charts.load("current", { packages: ["corechart"] });

function makeLineChart() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

    // Validate the number of checkboxes selected
    if (checkboxes.length !== 2) {
        alert("Please select exactly two samples for plotting.");
        return;
    }

    // Get the sample IDs from the checkboxes
    const sampleIds = Array.from(checkboxes).map(checkbox => checkbox.value);

    // Getting data for the selected samples
    const mydata = sampleIds.map(sampleId => {
        const input = document.getElementById(sampleId);
        const values = input.value.trim().split(/\s+/).map(Number);
        return {
            label: sampleId,
            values: values
        };
    });

    let data = new google.visualization.DataTable();
    mydata.forEach(sample => {
        data.addColumn("number", sample.label);
    });

    let rows = [];
    const numRows = Math.min(...mydata.map(sample => sample.values.length));

    for (let i = 0; i < numRows; i++) {
        let tempArray = mydata.map(sample => sample.values[i]);
        rows.push(tempArray);
    }

    data.addRows(rows);

    // Set options
    var options = {
        title: "Line Chart",
        hAxis: { title: mydata[0].label },
        vAxis: { title: mydata[1].label },
        legend: "both",
        series: mydata.map((sample, index) => ({ color: index === 0 ? "#e2431e" : "#4374e0", labelInLegend: sample.label }))
    };

    // Draw Chart
    var chart = new google.visualization.LineChart(
        document.getElementById("myChart")
    );
    chart.draw(data, options);
}
// End of Line Chart Plot funtion


//---------------------------------------------------------------------
// Start of scatter chart plot function
function makeScatterChart() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

    // Validate the number of checkboxes selected
    if (checkboxes.length !== 2) {
        alert("Please select exactly two samples for plotting.");
        return;
    }

    // Get the sample IDs from the checkboxes
    const sampleIds = Array.from(checkboxes).map(checkbox => checkbox.value);

    // Getting data for the selected samples
    const mydata = sampleIds.map(sampleId => {
        const input = document.getElementById(sampleId);
        const values = input.value.trim().split(/\s+/).map(Number);
        return {
            label: sampleId,
            values: values
        };
    });

    let data = new google.visualization.DataTable();
    data.addColumn("number", mydata[0].label);
    data.addColumn("number", mydata[1].label);

    let rows = [];
    const numRows = Math.min(...mydata.map(sample => sample.values.length));

    for (let i = 0; i < numRows; i++) {
        let tempArray = mydata.map(sample => sample.values[i]);
        rows.push(tempArray);
    }

    data.addRows(rows);

    // Set options
    var options = {
        title: "Scatter Plot",
        hAxis: { title: mydata[0].label },
        vAxis: { title: mydata[1].label },
        legend: "none",
        pointSize: 5,
        series: {
            0: { color: "#e2431e" }
        }
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
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

    // Validate the number of checkboxes selected
    if (checkboxes.length !== 2) {
        alert("Please select exactly two samples for plotting.");
        return;
    }

    // Get the sample IDs from the checkboxes
    const sampleIds = Array.from(checkboxes).map(checkbox => checkbox.value);

    // Getting data for the selected samples
    const mydata = sampleIds.map(sampleId => {
        const input = document.getElementById(sampleId);
        const values = input.value.trim().split(/\s+/).map(Number);
        return {
            label: sampleId,
            values: values
        };
    });

    let data = new google.visualization.DataTable();
    data.addColumn("number", mydata[0].label);
    data.addColumn("number", mydata[1].label);

    let rows = [];
    const numRows = Math.min(...mydata.map(sample => sample.values.length));

    for (let i = 0; i < numRows; i++) {
        let tempArray = mydata.map(sample => sample.values[i]);
        rows.push(tempArray);
    }

    data.addRows(rows);

    // Set options
    var options = {
        title: "Area Graph",
        hAxis: { title: mydata[0].label },
        vAxis: { title: mydata[1].label },
        legend: "none",
        series: {
            0: { color: "#e2431e" }
        }
    };

    // Draw Chart
    var chart = new google.visualization.AreaChart(
        document.getElementById("myChart")
    );
    chart.draw(data, options);
}


// End of Scatter Chart graph plot function
//--------------------------------------------------------------------






//--------------------------------------------------------------------

// Start of Table plot code
google.charts.load("current", { packages: ["table"] });
// Start of Table plot function
function makeTableChart() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

    // Validate the number of checkboxes selected
    if (checkboxes.length !== 2) {
        alert("Please select exactly two samples for plotting.");
        return;
    }

    // Get the sample IDs from the checkboxes
    const sampleIds = Array.from(checkboxes).map(checkbox => checkbox.value);

    // Getting data for the selected samples
    const mydata = sampleIds.map(sampleId => {
        const input = document.getElementById(sampleId);
        const values = input.value.trim().split(/\s+/).map(Number);
        return values;
    });

    let data = new google.visualization.DataTable();
    data.addColumn("number", sampleIds[0]);
    data.addColumn("number", sampleIds[1]);

    let rows = [];
    const numRows = Math.min(...mydata.map(sample => sample.length));

    for (let i = 0; i < numRows; i++) {
        let tempArray = mydata.map(sample => sample[i]);
        rows.push(tempArray);
    }

    data.addRows(rows);

    // Set Options
    let options = {
        title: "Data Table",
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


//
function calculateSpearmanRankCorrelation() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

    // Validate the number of checkboxes selected
    if (checkboxes.length !== 2) {
        alert("Please select exactly two samples for calculating Spearman's rank correlation coefficient.");
        return;
    }

    // Get the sample IDs from the checkboxes
    const sampleIds = Array.from(checkboxes).map(checkbox => checkbox.value);

    // Getting data for the selected samples
    const mydata = sampleIds.map(sampleId => {
        const input = document.getElementById(sampleId);
        const values = input.value.trim().split(/\s+/).map(Number);
        return values;
    });

    // Calculate the ranks of the samples
    const ranks = mydata.map(sample => {
        const sorted = [...sample].sort((a, b) => a - b);
        const ranks = sample.map(value => sorted.indexOf(value) + 1);
        return ranks;
    });

    // Calculate the differences between ranks
    const rankDifferences = ranks[0].map((rank, index) => rank - ranks[1][index]);

    // Calculate Spearman's rank correlation coefficient
    const n = rankDifferences.length;
    const sumSquaredDifferences = rankDifferences.reduce((sum, difference) => sum + difference ** 2, 0);
    const spearmanCoefficient = 1 - (6 * sumSquaredDifferences) / (n * (n ** 2 - 1));

    // Display the result in the result area
    const resultArea = document.getElementById("data-result-area");
    resultArea.innerHTML = `<p style="text-align: center;"><strong>Pearson's correlation coefficient :  ${spearmanCoefficient}</strong></p>`;

}

function calculatePearsonCorrelation() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

    // Validate the number of checkboxes selected
    if (checkboxes.length !== 2) {
        alert("Please select exactly two samples for calculating Pearson's correlation coefficient.");
        return;
    }

    // Get the sample IDs from the checkboxes
    const sampleIds = Array.from(checkboxes).map(checkbox => checkbox.value);

    // Getting data for the selected samples
    const mydata = sampleIds.map(sampleId => {
        const input = document.getElementById(sampleId);
        const values = input.value.trim().split(/\s+/).map(Number);
        return values;
    });

    // Calculate the means of the samples
    const means = mydata.map(sample => {
        const sum = sample.reduce((total, value) => total + value, 0);
        return sum / sample.length;
    });

    // Calculate the differences from the means
    const differences = mydata.map((sample, index) => sample.map(value => value - means[index]));

    // Calculate the sum of the products of differences
    let sumProductDifferences = 0;
    for (let i = 0; i < differences[0].length; i++) {
        sumProductDifferences += differences[0][i] * differences[1][i];
    }

    // Calculate the sum of squared differences
    const sumSquaredDifferences = differences.map(sample => sample.reduce((total, difference) => total + difference ** 2, 0));

    // Calculate Pearson's correlation coefficient
    const denominator = Math.sqrt(sumSquaredDifferences[0] * sumSquaredDifferences[1]);
    const pearsonCoefficient = sumProductDifferences / denominator;

    // Display the result in the result area
    const resultArea = document.getElementById("data-result-area");
    resultArea.innerHTML = `<p style="text-align: center;"><strong>Pearson's correlation coefficient:    ${pearsonCoefficient}</strong></p>`;
}

function createArrayInput() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

    // Validate the number of checkboxes selected
    if (checkboxes.length !== 2) {
        alert("Please select exactly two samples for creating the input array.");
        return;
    }

    const sampleIds = Array.from(checkboxes).map(checkbox => checkbox.value);
    const sampleLabels = sampleIds.join(" / ");

    const sampleRanges = sampleIds.map(sampleId => {
        const input = document.getElementById(sampleId);
        return input.value.trim().split(/\s+/).map(range => range.split('-').map(Number));
    });

    const xRanges = sampleRanges[0];
    const yRanges = sampleRanges[1];

    const arrayInputDiv = document.getElementById("inputTable");
    arrayInputDiv.innerHTML = "";

    const table = document.createElement("table");
    table.id = "inputTable";

    // Create the top left cell with sample IDs
    const topLeftCell = document.createElement("th");
    topLeftCell.textContent = sampleLabels;
    table.appendChild(topLeftCell);

    // Create the table header row with y range values as headings
    const headerRow = document.createElement("tr");
    const emptyCell = document.createElement("th"); // Empty cell for top-left corner
    headerRow.appendChild(emptyCell);

    for (let j = 0; j < yRanges.length; j++) {
        const headerCell = document.createElement("th");
        headerCell.textContent = yRanges[j].join("-");
        headerRow.appendChild(headerCell);
    }

    table.appendChild(headerRow);

    // Create the table rows with x range values as column labels
    for (let i = 0; i < xRanges.length; i++) {
        const row = document.createElement("tr");
        const xLabelCell = document.createElement("th");
        xLabelCell.textContent = xRanges[i].join("-");
        row.appendChild(xLabelCell);

        for (let j = 0; j < yRanges.length; j++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "text";
            input.className = "input-cell";
            cell.appendChild(input);
            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    arrayInputDiv.appendChild(table);
    document.getElementById("calculateButton").style.display = "block";

}

function storeArrayInput() {
    const inputTable = document.getElementById("inputTable");
    const rows = inputTable.getElementsByTagName("tr");

    const frequencyTable = [];

    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        const rowValues = [];

        for (let j = 0; j < cells.length; j++) {
            const inputValue = cells[j].querySelector("input").value;
            const frequency = parseInt(inputValue);

            if (isNaN(frequency) || frequency < 0) {
                alert("Please enter a valid number for all input cells.");
                return null;
            }

            rowValues.push(frequency);
        }

        frequencyTable.push(rowValues);
    }

    return frequencyTable;
}

function correlationCoefficientGroupedData() {
    const frequencyTable = storeArrayInput();

    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

    if (checkboxes.length !== 2) {
        alert("Please select exactly two samples for calculating range means.");
        return;
    }

    const sampleIds = Array.from(checkboxes).map(checkbox => checkbox.value);
    const rangeMeans = [];

    sampleIds.forEach(sampleId => {
        const input = document.getElementById(sampleId);
        const rangeValues = input.value.trim().split(' ');

        const sampleRangeMeans = rangeValues.map(range => {
            const [lower, upper] = range.split('-').map(Number);
            return (lower + upper) / 2;
        });

        rangeMeans.push(sampleRangeMeans);
    });

    let fdx = 0;
    let fdx2 = 0;
    let fdxdy = 0;
    let fdy = 0;
    let fdy2 = 0;
    let n = 0;

    for (let i = 0; i < rangeMeans[0].length; i++) {
        for (let j = 0; j < rangeMeans[1].length; j++) {
            const frequency = frequencyTable[i][j];

            fdx += frequency * rangeMeans[0][i];
            fdx2 += frequency * rangeMeans[0][i] * rangeMeans[0][i];
            fdxdy += frequency * rangeMeans[0][i] * rangeMeans[1][j];
            fdy += frequency * rangeMeans[1][j];
            fdy2 += frequency * rangeMeans[1][j] * rangeMeans[1][j];
            n += frequency;
        }
    }

    const regressionSlopeX = (n * fdxdy - fdx * fdy) / (n * fdx2 - fdx * fdx);
    const regressionInterceptX = (fdy - regressionSlopeX * fdx) / n;
    const regressionSlopeY = (n * fdxdy - fdx * fdy) / (n * fdy2 - fdy * fdy);
    const regressionInterceptY = (fdx - regressionSlopeY * fdy) / n;


    const [sampleX, sampleY] = rangeMeans;
    const regressionX = regression(sampleX, sampleY);
    const regressionY = regression(sampleY, sampleX);

    const resultArea = document.getElementById("data-result-area");
    resultArea.innerHTML = `
    <p><strong>Regression of ${sampleIds[0]} with respect to ${sampleIds[1]}:</strong></p>
    <p>Equation: y = ${regressionX.slope.toFixed(2)}x + ${regressionX.intercept.toFixed(2)}</p>
    <br>
    <p><strong>Regression of ${sampleIds[1]} with respect to ${sampleIds[0]}:</strong></p>
    <p>Equation: x = ${regressionY.slope.toFixed(2)}y + ${regressionY.intercept.toFixed(2)}</p>    
    `;

    const ctx = document.getElementById('myChart').getContext('2d');

    const data = {
        datasets: [{
                label: `Regression of ${sampleIds[0]} with respect to ${sampleIds[1]}`,
                data: [],
                borderColor: 'blue',
                fill: false,
                pointRadius: 0,
                showLine: true,
            },
            {
                label: `Regression of ${sampleIds[1]} with respect to ${sampleIds[0]}`,
                data: [],
                borderColor: 'red',
                fill: false,
                pointRadius: 0,
                showLine: true,
            }
        ]
    };

    // let myslope = 1 / regressionX.slope;
    // let myintercept = -regressionX.intercept / regressionX.slope;
    // Generate data points for the first regression equation

    for (let x = Math.min(...sampleX); x <= Math.max(...sampleX); x++) {
        const y = regressionX.slope * x + regressionX.intercept;
        data.datasets[0].data.push({ x, y });
    }

    // Generate data points for the second regression equation
    for (let y = Math.min(...sampleY); y <= Math.max(...sampleY); y++) {
        const x = regressionY.slope * y + regressionY.intercept;
        data.datasets[1].data.push({ x, y });
    }

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    const canvasWidth = 800;
    const canvasHeight = 600;

    const options = {
        responsive: true,
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: `${sampleIds[0]}`
                }
            },
            y: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: `${sampleIds[1]}`
                }
            }
        }
    };

    new Chart(ctx, {
        type: 'scatter',
        data: data,
        options: options
    });

}


function calculateRegression() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

    if (checkboxes.length !== 2) {
        alert("Please select exactly two samples for calculating regression.");
        return;
    }

    const sampleIds = Array.from(checkboxes).map(checkbox => checkbox.value);
    const sampleData = [];

    sampleIds.forEach(sampleId => {
        const input = document.getElementById(sampleId);
        const values = input.value.trim().split(' ').map(Number);

        sampleData.push(values);
    });

    const [sampleX, sampleY] = sampleData;
    const regressionX = regression(sampleX, sampleY);
    const regressionY = regression(sampleY, sampleX);

    const resultArea = document.getElementById("data-result-area");
    resultArea.innerHTML = `
        <p><strong>Regression of ${sampleIds[0]} with respect to ${sampleIds[1]}:</strong></p>
        <p>Equation: y = ${regressionX.slope.toFixed(2)}x + ${regressionX.intercept.toFixed(2)}</p>
        <br>
        <p><strong>Regression of ${sampleIds[1]}  with respect to ${sampleIds[0]} :</strong></p>
        <p>Equation: x = ${regressionY.slope.toFixed(2)}y + ${regressionY.intercept.toFixed(2)}</p>
    `;

    const ctx = document.getElementById('myChart').getContext('2d');

    const data = {
        datasets: [{
                label: `Regression of ${sampleIds[0]} with respect to ${sampleIds[1]}`,
                data: [],
                borderColor: 'blue',
                fill: false,
                pointRadius: 0,
                showLine: true,
            },
            {
                label: `Regression of ${sampleIds[1]} with respect to ${sampleIds[0]}`,
                data: [],
                borderColor: 'red',
                fill: false,
                pointRadius: 0,
                showLine: true,
            },
            {
                label: `${sampleIds[0]} vs ${sampleIds[1]}`,
                data: sampleX.map((x, i) => ({ x, y: sampleY[i] })),
                backgroundColor: 'green',
                pointRadius: 3,
                pointBackgroundColor: 'green',
                showLine: false,
            }
        ]
    };

    // let myslope = 1 / regressionX.slope;
    // let myintercept = -regressionX.intercept / regressionX.slope;
    // Generate data points for the first regression equation

    for (let x = Math.min(...sampleX); x <= Math.max(...sampleX); x++) {
        const y = regressionX.slope * x + regressionX.intercept;
        data.datasets[0].data.push({ x, y });
    }

    // Generate data points for the second regression equation
    for (let y = Math.min(...sampleY); y <= Math.max(...sampleY); y++) {
        const x = regressionY.slope * y + regressionY.intercept;
        data.datasets[1].data.push({ x, y });
    }

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    const canvasWidth = 800;
    const canvasHeight = 600;

    const options = {
        responsive: true,
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: `${sampleIds[0]}`
                }
            },
            y: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: `${sampleIds[1]}`
                }
            }
        }
    };

    new Chart(ctx, {
        type: 'scatter',
        data: data,
        options: options
    });
}



function regression(sampleX, sampleY) {
    const n = sampleX.length;

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    for (let i = 0; i < n; i++) {
        sumX += sampleX[i];
        sumY += sampleY[i];
        sumXY += sampleX[i] * sampleY[i];
        sumX2 += sampleX[i] * sampleX[i];
    }

    const meanX = sumX / n;
    const meanY = sumY / n;

    const slope = (sumXY - n * meanX * meanY) / (sumX2 - n * meanX * meanX);
    const intercept = meanY - slope * meanX;

    return { slope, intercept };
}