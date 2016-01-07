// JavaScript source code

//$('.row .btn').on('click', function (e) {
//    e.preventDefault();
//    var $this = $(this);
//    var $collapse = $this.closest('.collapse-group').find('.collapse');
//    $collapse.collapse('toggle');
//});
// how to stick a div
//http://www.pixelbind.com/examples/stick-a-div/
// How to put all elements' content in array using jQuery ?
// ref: http://stackoverflow.com/questions/4948770/how-to-put-all-elements-content-in-array-using-jquery
//var items = [];

//$('#main p').each(function (i, e) {
//    items.push($(e).text());
//});




// Weight elements of loadsheet
var MAC = 150;
var LEMAC = 850;
var USGperlb = 7.5;
var ACFuelBurn = [[0, 762.3], [50, 762.1], [100, 761.8], [200, 761.2], [300, 760.5], [400, 760], [500, 759.4], [600, 758.9], [700, 758.4], [800, 758],
    [900, 757.5], [1000,757.1 ], [1100,756.8 ], [1200,756.4 ], [1300, 756.1], [1400,755.8 ], [1500, 755.6], [1600, 755.3]];


var OPItemsWeightSubTotals = [];
var OPItemsCGArraySubtotals = [];
var OWEWElements = [];
var OWECGElements = [];
var PLWWElementsSubTotals = [];
var PLCGArraySubTotals = [];

var ZFWWElements = [];
var ZFWCGElements = [];
var RWWElements = [];
var RWCGElements = [];
var TOWWElements = [];
var TOWCGElements = [];
var LWWElements = [];
var LWCGElements = [];

// Variables for the chart
//a null signifies separate line segments
var placeholder = $("#LoadsheetChart");

var TEWPoint = {label:"TEW",points: { show: true },data:[[0, 0]]};
var OWEPoint = {label:"OWE",points: { show: true },data:[[0, 0]]};
var ZFWPoint = {label:"ZFW",points: { show: true },data:[[0, 0]]};
var TOWPoint = {label:"TOW",points: { show: true },data:[[0, 0]]};
var RWPoint = {label:"RW",points: { show: true },data:[[0, 0]]};
var LWPoint = { label: "LW", points: { show: true },data: [[0, 0]] };

var options = {
    series: {
        legend: { show: true },
        lines: { show: true },
    }
};

var fuelcurve = [[38.6850, 24342], [33.0932, 26097], [32.6679, 26347],
      [32.2577, 26597], [31.8630, 26847], [31.4838, 27097],
      [31.1204, 27347], [30.7726, 27597], [30.4404, 27847],
      [30.1235, 28097], [29.8218, 28347], [29.5349, 28597],
      [29.2623, 28847], [29.0038, 29097], [28.7588, 29347],
      [28.5268, 29597], [28.3073, 29847], [28.0998, 30097], [27.9037, 30347],
      [27.7184, 30597], [27.5435, 30847], [27.3784, 31097], [27.2224, 31347],
      [27.0752, 31597], [26.9361, 31847], [26.8048, 32097], [26.6808, 32347], [26.5636, 32597],
      [26.4530, 32847], [26.3484, 33097], [26.2498, 33347], [26.1567, 33597], [26.0691, 33847],
      [25.9868, 34097], [25.9097, 34347], [25.8378, 34597], [25.7711, 34847], [25.7097, 35097], [25.6538, 35347],
      [25.6037, 35597], [25.5596, 35847], [25.5220, 36097], [25.4913, 36347], [25.4681, 36597], [25.4530, 36847],
      [25.4466, 37097], [25.4499, 37347], [25.4636, 37597], [25.4887, 37847], [25.5263, 38097], [25.5775, 38347],
      [25.6436, 38597], [25.7258, 38847], [25.8257, 39097], [25.9447, 39347], [26.0844, 39597], [26.2466, 39847], [26.4330, 40097]];

var envelope = [[20, 71700], [20, 98000], [28, 129700], [38, 129700], [38, 119840], [43, 102200], [43, 94000], [34, 71700], [20, 71700]];


$(document).ready(function () {
    //flot chart function
    $("<div id='tooltip'></div>").css({
        position: "absolute",
        display: "none",
        border: "1px solid #fdd",
        padding: "2px",
        "background-color": "#fee",
        opacity: 0.80
    }).appendTo("body");

    $("#LoadsheetChart").bind("plothover", function (event, pos, item) {

        if ($("#enablePosition:checked").length > 0) {
            var str = "(" + pos.x.toFixed(2) + ", " + pos.y.toFixed(2) + ")";
            $("#hoverdata").text(str);
        }

        if ($("#enableTooltip:checked").length > 0) {
            if (item) {
                var x = item.datapoint[0].toFixed(2),
                    y = item.datapoint[1].toFixed(2);

                $("#tooltip").html(item.series.label + " of " + x + " = " + y)
                    .css({ top: item.pageY + 5, left: item.pageX + 5 })
                    .fadeIn(200);
            } else {
                $("#tooltip").hide();
            }
        }
    });

    $("#LoadsheetChart").bind("plotclick", function (event, pos, item) {
        if (item) {
            $("#clickdata").text(" - click point " + item.dataIndex + " in " + item.series.label);
            plot.highlight(item.series, item.datapoint);
        }
    });

    //Format LoadSheet Elelements
    $("[id*='_CG']").addClass("form-control input-sm text-right");
    $("[id*='_Weight']").addClass("form-control input-sm text-right");
    $("[id*='TXFuelWeight']").addClass("form-control input-sm text-right");
    $("[id*='TRPFuelWeight']").addClass("form-control input-sm text-right");
    //fait les calculs avec les données présente dans le Html.

    //alert ("Store TEW and CG");
    StoreTEWandCG(OWEWElements, OWECGElements, "[id*='W_OWE_TEW']", "[id*='CG_OWE_TEW']");
    //alert("OWE Weight Array  =" + OWEWElements.join("\n"));
    //alert("OWE CG array =" + OWECGElements.join("\n"));

    UpdateOWEandAfert();

    //assigner les events pour faire la mise a jour des calculs.
    $("[id*='Crews_Weight'],[id*='Crews_CG']").change(function () {
        UpdateOWEandAfert();
    });

    $("[id*='G1_Weight'],[id*='G1_CG']").change(function () {
        UpdateOWEandAfert();
    });
    $("[id*='CAB1_Weight'],[id*='CAB1_Weight']").change(function () {
        UpdateOWEandAfert();
    });
    $("[id*='W_OP_']").change(function () {
        UpdateOWEandAfert();
    });
    $("[id*='W_OWE_']").change(function () {
        UpdateOWEandAfert();
    });
    $("[id*='Pax_Weight'], [id *= 'Pax_CG']").change(function () {
        UpdateZFWandAfter();
    });
    $("[id*='Cargo1_Weight'],[id*='Cargo1_CG']").change(function () {
        UpdateZFWandAfter();
    });
    $("[id*='W_PL_']").change(function () {
        UpdateZFWandAfter();
    });
    $("[id*='W_ZFW_']").change(function () {
        UpdateZFWandAfter();
    });
    $("[id*='Fuel_Weight']").change(function () {
        UpdateRWandAfter();
    });
    $("[id*='W_RW_']").change(function () {
        UpdateRWandAfter();
    });

    $("#W_RWTotalWeight").change(function () {
        UpdateRWandAfter();
    });
    //TXFuelWeight
    $("#TXFuelWeight").change(function () {
        UpdateTOWandAfter();
    });
    $("#TRPFuelWeight").change(function () {
        UpdateLW();
    });
    
   

});

function UpdateOWEandAfert() {
    //alert("Do sub total of Operating items weight");
    //alert("Check some element index first in W_OP_");
    //var mytest = GetLSElementIndex("[id*='W_OP_']", "W_OP_CAB1Items");

    //alert("Check some element index first in W_OWE_ ");
    //var mytest = GetLSElementIndex("[id*='W_OWE_']", "W_OWE_OPTotal");

    //alert("Check some element index first in W_ZFW_");
    //var mytest = GetLSElementIndex("[id*='W_ZFW_']", "W_ZFW_OWE");
    
    CalcItemsWeightandCG("[id*='Crews_Weight']", "[id*='Crews_CG']", "[id='W_OP_CrewsItems']", "[id='CG_OP_CrewsItems']", "[id*='W_OP_']", "W_OP_CrewsItems", OPItemsWeightSubTotals, OPItemsCGArraySubtotals);
    CalcItemsWeightandCG("[id*='G1_Weight']", "[id*='G1_CG']", "[id='W_OP_G1Items']", "[id='CG_OP_G1Items']", "[id*='W_OP_']", "W_OP_G1Items", OPItemsWeightSubTotals, OPItemsCGArraySubtotals);
    CalcItemsWeightandCG("[id*='CAB1_Weight']", "[id*='CAB1_CG']", "[id='W_OP_CAB1Items']", "[id='CG_OP_CAB1Items']", "[id*='W_OP_']", "W_OP_CAB1Items", OPItemsWeightSubTotals, OPItemsCGArraySubtotals);

    //alert("Operatings Items Weight Subtotals   =" + OPItemsWeightSubTotals.join("\n"));
    //alert("Operatings Items CG Subtotals   =" + OPItemsCGArraySubtotals.join("\n"));


        
    //alert("Next Do operating weight items total");
    CalcSubTotalWeightandCG(OPItemsWeightSubTotals, OPItemsCGArraySubtotals, OWEWElements, OWECGElements, "[id*='W_OWE_']", "W_OWE_OPTotal", "[id='W_OWE_OPTotal']", "[id='CG_OWE_OPTotal']");
    
    //alert("Next Do OWE (Operating Weight Empty) calcs");
    CalcSubTotalWeightandCG(OWEWElements, OWECGElements, ZFWWElements, ZFWCGElements, "[id*='W_ZFW_']", "W_ZFW_OWE", "[id='W_ZFW_OWE']", "[id*='CG_ZFW_OWE']");
    
    //Display the point on the chart and put the MAC on the loadsheet
    OWEPoint.data[0][1] = ZFWWElements[0];
    OWEPoint.data[0][0] = GetMAC(ZFWCGElements[0], "[id='MAC_ZFW_OWE']");

    UpdateZFWandAfter();
}

function StoreTEWandCG(myArrayWeight, myArrayCG, TEWWeightElement, TEWCGElement) {
    // Convertir la valeur dans l'élément input et place cette valeur dans l'array

    $(TEWWeightElement).each(function (i, e) {
        var myWeight;
        myweight = parseFloat($(this).text());
        myArrayWeight.push(myweight);
    });
  
    $(TEWCGElement).each(function (i, e) {
        var myCG;
        myCG = parseFloat($(this).text());
        myArrayCG.push(myCG);

    });

    TEWPoint.data[0][1] = myArrayWeight[0];
    TEWPoint.data[0][0] = GetMAC(myArrayCG[0], "[id='MAC_OWE_TEW']");


}

function UpdateZFWandAfter() {
    //alert("Next Do sub total of Payload items weight");

    //alert("Next Do sub total Pax");
    CalcItemsWeightandCG("[id*='Pax_Weight']", "[id*='Pax_CG']", "[id='W_PL_PAXItems']", "[id='CG_PL_PAXItems']", "[id*='W_PL_']", "W_PL_PAXItems", PLWWElementsSubTotals, PLCGArraySubTotals);

    //alert("Next Do sub total Cargo");
    CalcItemsWeightandCG("[id*='Cargo1_Weight']", "[id*='Cargo1_CG']", "[id='W_PL_Cargo1Items']", "[id='CG_PL_Cargo1Items']", "[id*='W_PL_']", "W_PL_Cargo1Items", PLWWElementsSubTotals, PLCGArraySubTotals);

    //alert("Next Do Payload Weight items Total");
    CalcSubTotalWeightandCG(PLWWElementsSubTotals, PLCGArraySubTotals, ZFWWElements, ZFWCGElements, "[id*='W_ZFW_']", "W_ZFW_PLTotal", "[id='W_ZFW_PLTotal']", "[id='CG_ZFW_PLTotal']");
    

    //alert("Next Do ZFW (Zero Fuel_Weight) calc");
    CalcSubTotalWeightandCG(ZFWWElements, ZFWCGElements, RWWElements, RWCGElements, "[id*='W_RW_']", "W_RW_ZFWTotal", "[id='W_RW_ZFWTotal']", "[id='CG_RW_ZFWTotal']");

    ZFWPoint.data[0][1] = RWWElements[0];
    ZFWPoint.data[0][0] = GetMAC(RWCGElements[0], "[id='MAC_RW_ZFW']");

    UpdateRWandAfter();
}

function UpdateRWandAfter() {
    // Do total Fuel Weight
    
    //alert("Next Do total Fuel Weight");
    CalcItemsWeightandCG("[id*='Fuel_Weight']", "[id*='Fuel_CG']", "[id='W_RW_FuelItems']", "[id='CG_RW_FuelItems']", "[id*='W_RW_']", "W_RW_FuelItems", RWWElements, RWCGElements);
    
    //alert("Do RW (Ramp Weight) calc");
    CalcSubTotalWeightandCG(RWWElements, RWCGElements,TOWWElements,TOWCGElements, "[id*='W_TOW_']", "W_TOW_RWTotal", "[id='W_TOW_RWTotal']", "[id='CG_TOW_RWTotal']");

    TOWPoint.data[0][1] = TOWWElements[0];
    TOWPoint.data[0][0] = GetMAC(TOWCGElements[0], "[id='MAC_TOW_RWTotal']");

    UpdateTOWandAfter();
}

function UpdateTOWandAfter() {
    //alert("calc TOW  Take Off Weight");
    SubStractWeight(TOWWElements, TOWCGElements, RWWElements, RWCGElements, "#TXFuelWeight", "#TXFuelCG", "#TOWWeight", "#TOWCG");

    RWPoint.data[0][1] = RWWElements[0];
    RWPoint.data[0][0] = GetMAC(RWCGElements[0], "[id='TOWMAC']");

    UpdateLW();
}

function UpdateLW() {
    //calc LW  Landing Weight
    SubStractWeight(RWWElements, RWCGElements, LWWElements, LWCGElements, "#TRPFuelWeight", "#TRPFuelCG", "#LWWeight", "#LWCG");
    LWPoint.data[0][1] = LWWElements[0];
    LWPoint.data[0][0] = GetMAC(LWCGElements[0], "[id='LWMAC']");
   // alert("Redraw the new Landing weight = " + LWWElements[0].toString());
    LSChart = $.plot($("#LoadsheetChart"), [envelope, fuelcurve, TEWPoint, OWEPoint, ZFWPoint, RWPoint, TOWPoint, LWPoint], options);

    // Add the Flot version string to the footer

    $("#footer").prepend("Flot " + $.plot.version + " &ndash; ");

    $("<div id='tooltip'></div>").css({
        position: "absolute",
        display: "none",
        border: "1px solid #fdd",
        padding: "2px",
        "background-color": "#fee",
        opacity: 0.80
    }).appendTo("body");

   


    
    //LSChart.setData([envelope, fuelcurve, TEWPoint, OWEPoint, ZFWPoint, RWPoint, TOWPoint, LWPoint]);
    //LSChart.setupGrid(); //only necessary if your new data will change the axes or grid
    //LSChart.draw();
    

}

function SubStractWeight(weight1, cg1, weight2, cg2, weightElement, cgElement, RemainingWeight, NewCG) {
    var tempweight = 0.0;
    var tempmoment = 0.0;
    var CG = 0.0
    //tempweight = parseFloat($(weight1).text()) - parseFloat($(weight2).val());
    weight1[1] = -parseFloat($(weightElement).val());
    cg1[1] = parseFloat($(cgElement).text());

    tempweight = weight1[0] - weight1[1];
    tempmoment = weight1[0]*cg1[0] - weight1[1]*cg1[1];
    CG = tempmoment/tempweight
    //alert("Weight to add = " + weight1.join(" , "));
    //alert("CG for each weight = " + cg1.join(" , "));

    weight2[0] = tempweight;
    cg2[0] = CG;
    $(RemainingWeight).text(tempweight.toString());
    $(NewCG).text(CG.toFixed(2).toString());

}


function CalcItemsWeightandCG(WofItems, CGofItems, TotalWeight, TotalCG, ElementsGrouping,Element,WeightArray, CGArray) {
    var SubTotalWeight = 0.0;
    var myWeights = [];
    var myCG = [];
    var TotalMoments = 0;
    var CenterofGravity = 0;
    // Convertir la valeur dans l'élément input et place cette valeur dans l'array
    $(WofItems).each(function (i, e) {
        myWeights.push(this.value);
    });

    $(CGofItems).each(function (i, e) {
        myCG.push(this.value);
    });
    var nbofElements = myWeights.length;

    //Calcul le moment total
    for (var j = 0; j < nbofElements; j++) {
        TotalMoments = TotalMoments + myWeights[j] * myCG[j];
    };
    // Fait la somme des poids
    $(WofItems).each(function () {
        SubTotalWeight += parseFloat(this.value);
    });
    //Calcul le centre de gravite (cg) Total
    CenterofGravity = TotalMoments / SubTotalWeight;
   //get the index to store the value in an array
    var myindexgroup = GetLSElementIndex(ElementsGrouping, Element);
    WeightArray[myindexgroup] = SubTotalWeight;
    CGArray[myindexgroup] = CenterofGravity;
    //alert("my weight array=" + WeightArray.join("\n"));
    //alert("my CG array =" + CGArray.join("\n"));


    // display le poids total
    $(TotalWeight).text(SubTotalWeight.toFixed(2).toString());
    // display le CG total
    $(TotalCG).text(CenterofGravity.toFixed(2).toString());
}


function CalcSubTotalWeightandCG(myWeightArray, myCGArray,ParentWeightArray,ParentCGArray,ElementGroup,Element, subTotalWeightElement, subTotalCGElement) {
    var TotalWeight = 0.0
    var TotalCG = 0.0
    var TotalMoments = 0.0
    var nbofElements = myWeightArray.length;
    

    //Calcul le moment total
    for (var j = 0; j < nbofElements; j++) {
        TotalWeight = TotalWeight + myWeightArray[j];
        TotalMoments = TotalMoments + myWeightArray[j] * myCGArray[j];
    };
    // Fait la somme des poids
    //Calcul le centre de gravite (cg) Total
    TotalCG = TotalMoments / TotalWeight;
    //alert("Total Weight = " + TotalWeight.toFixed(2).toString() + ", Total CG = " + TotalCG.toFixed(2).toString());
    $(subTotalWeightElement).text(TotalWeight.toFixed(2).toString());
    $(subTotalCGElement).text(TotalCG.toFixed(2).toString());
    //get the index to store the value in an array
    var myindexgroup = GetLSElementIndex(ElementGroup, Element);
    ParentWeightArray[myindexgroup] = TotalWeight;
    ParentCGArray[myindexgroup]= TotalCG;

    //ParentWeightArray.splice(myindexgroup, 0, TotalWeight);
    //ParentCGArray.splice(myindexgroup, 0, TotalCG);

    //alert("CalcSubTotalWeightandCG weight array =" + ParentWeightArray.join("\n"));
    //alert("CalcSubTotalWeightandCG CG array =" + ParentCGArray.join("\n"));


}

// Get the index element in a group of element
 function GetLSElementIndex(ElementGroup, Element) {
     var elementIndex;/* store the index of #element here */
     $(ElementGroup).each(function (index) {
        var someText = $(this).attr('id');
        if (someText == Element) {
            elementIndex = index;
            //alert("GetLSElementIndex is: " + someText + " and my index in the group element is " + index);
        }
    });
     return elementIndex; /* will return index of #element if found otherwise will return undefined */
}



function handleFileSelect() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {

    } else {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }

    input = document.getElementById('fileinput');
    if (!input) {
        alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
    }
    else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsText(file);

    }
}

function receivedText() {
    //Lire le fichier ACEnvelopes.json et remplacer les valeur de la varialble envelope
    var mydb = JSON.parse(fr.result);
    alert(mydb.Envelopes.Envelpope_ID[2]);
    alert(mydb.Envelopes.CG_MAC[2]);
    alert(mydb.Envelopes.Weight_Imp[2]);

    alert(envelope.lenght);
}

function GetMAC(ToConvert,MACElement) {
    var mymac = 0;
    mymac = (ToConvert - LEMAC) / MAC * 100;
    //alert(MACElement + " = "+mymac.toFixed(2).toString());
    $(MACElement).text(mymac.toFixed(2).toString());

    return mymac;
}

