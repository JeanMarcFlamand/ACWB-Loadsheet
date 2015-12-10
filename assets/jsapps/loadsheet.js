// JavaScript source code

//$('.row .btn').on('click', function (e) {
//    e.preventDefault();
//    var $this = $(this);
//    var $collapse = $this.closest('.collapse-group').find('.collapse');
//    $collapse.collapse('toggle');
//});
$(document).ready(function () {
    $("[id*='_CG']").addClass("form-control input-sm text-right");
    $("[id*='_Weight']").addClass("form-control input-sm text-right");
    $("[id*='TXFuelWeight']").addClass("form-control input-sm text-right");
    $("[id*='TRPFuelWeight']").addClass("form-control input-sm text-right");
    //fait les calculs avec les données présente dans le Html.
    
    myindex = GetLSElementIndex("[id*='W_OP_']", "W_OP_CAB1Items");
    //alert(myindex.toString + "  is the index to store the value in the array");
    alert(myindex);

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
// how to stick a div
//http://www.pixelbind.com/examples/stick-a-div/
// How to put all elements' content in array using jQuery ?
// ref: http://stackoverflow.com/questions/4948770/how-to-put-all-elements-content-in-array-using-jquery
//var items = [];

//$('#main p').each(function (i, e) {
//    items.push($(e).text());
//});

// Sub weight elements of loadsheet
var CrewsWeight = [];
var CrewsCG = [];
var G1Weight = [];
var G1CG = [];
var Cab1Weight = [];
var Cab1CG = [];
var PaxWeight = [];
var PaxCG = [];
var CargoWeight = [];
var CargoCG = [];
var FuelWeight = [];
var FuelCG = [];

var OperatingItemsWeight = [];
var OperatingItemsCG = [];
var ZeroFuelWeight = [];
var ZeroFuelCG = [];
var RampWeight = [];
var RampCG = [];
var TakeofWeight = [];
var TakeofCG = [];
var LandingWeight = [];
var LandingCG = [];




function UpdateOWEandAfert() {
    // Do sub total of Operating items weight
    var myindex = GetLSElementIndex("[id*='W_OP_']", "W_OP_CAB1Items")

    CalcItemsWeightandCG("[id*='Crews_Weight']", "[id*='Crews_CG']", "[id='W_OP_CrewsItems']", "[id='CG_OP_CrewsItems']", "[id*='W_OP_']", "W_OP_CrewsItems",CrewsWeight,CrewsCG);
    CalcItemsWeightandCG("[id*='G1_Weight']", "[id*='G1_CG']", "[id='W_OP_G1Items']", "[id='CG_OP_G1Items']", "[id*='W_OP_']", "W_OP_G1Items",G1Weight,G1CG);
    CalcItemsWeightandCG("[id*='CAB1_Weight']", "[id*='CAB1_CG']", "[id='W_OP_CAB1Items']", "[id='CG_OP_CAB1Items']", "[id*='W_OP_']", "W_OP_CAB1Items",Cab1Weight,Cab1CG);

    // Do operating weight items total
    //CalcSubTotalWeight("[id*='W_OP_']", "[id='W_OWE_OPTotalOPWeight']");
    CalcSubTotalWeightandCG(OperatingItemsWeight, "[id*='W_OP_']", "[id='W_OWE_OPTotalOPWeight']");
    // Do OWE (Operating Weight Empty) calcs
    CalcSubTotalWeight("[id*='W_OWE_']", "[id='W_ZFW_OWE']");
    UpdateZFWandAfter();
}

function UpdateZFWandAfter() {
    // Do sub total payload
    CalcItemsWeightandCG("[id*='Pax_Weight']", "[id*='Pax_CG']", "[id='W_PL_PAXItems']", "[id='CG_PL_PAXItems']", "[id*='W_PL_']", "W_PL_PAXItems",PaxWeight,PaxCG);

    CalcItemsWeightandCG("[id*='Cargo1_Weight']", "[id*='Cargo1_CG']", "[id='W_PL_Cargo1Items']", "[id='CG_PL_Cargo1Items']", "[id*='W_PL_']", "W_PL_Cargo1Items",CargoWeight,CargoCG);

    // Do Payload Weight total
    CalcSubTotalWeight("[id*='W_PL_']", "[id='W_ZFW_PLTotalWeight']");

    // Do ZFW (Zero Fuel_Weight) calc
    CalcSubTotalWeight("[id*='W_ZFW_']", "[id='W_RW_ZFWTotalWeight']");
    UpdateRWandAfter();
}

function UpdateRWandAfter() {
    // Do total Fuel Weight
    CalcItemsWeight("[id*='Fuel_Weight']", "[id='W_RW_Total_FuelWeight']");

    // Do RW (Ramp Weight) calc
    CalcSubTotalWeight("[id*='W_RW_']", "[id='RWWeight']");

    UpdateTOWandAfter();
}


function UpdateTOWandAfter() {
    //calc TOW  Take Off Weight
    SubStractWeight("#RWWeight", "#TXFuelWeight", "#TOWWeight");
    UpdateLW();
}

function UpdateLW() {
    //calc LW  Landing Weight
    SubStractWeight("#TOWWeight", "#TRPFuelWeight", "#LW");
}

function SubStractWeight(weight1, weight2, RemainingWeight) {
    var tempweight = 0.0;
    tempweight = parseFloat($(weight1).text()) - parseFloat($(weight2).val());
    $(RemainingWeight).text(tempweight.toString());
}

function CalcItemsWeight(WofItems, Total) {
    var SubTotalWeight = 0.0;
    $(WofItems).each(function () {
        SubTotalWeight += parseFloat(this.value);
    });
    $(Total).text(SubTotalWeight.toString());
}

function CalcItemsWeightandCG(WofItems, CGofItems, TotalWeight, TotalCG, ElementsGrouping,Element,WeightArray, CGArray) {
    var SubTotalWeight = 0.0;
    var myWeights = [];
    var myCG = [];
    var TotalMoments = 0;
    var CenterofGravity = 0;
    // Converti la valeur dans l'élément input et place cette valeur dans l'array
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
    alert(WeightArray.join("\n"));
    alert(CGArray.join("\n"));


    // display le poids total
    $(TotalWeight).text(SubTotalWeight.toString());
    

    // display le CG total
    $(TotalCG).text(CenterofGravity.toString());
}

function CalcSubTotalWeight(subItems, subTotal) {
    var SubTotalWeight = 0.0;
    $(subItems).each(function () {
        SubTotalWeight += parseFloat($(this).text());
    });
    $(subTotal).text(SubTotalWeight.toString());

}

//function CalcSubTotalWeightandCG(myWeightArray, myCGArray, subItemsWeight, subItemsCG, subTotalWeight, subTotalCG) {
function CalcSubTotalWeightandCG(myWeightArray, subItemsWeight, subTotalWeight) {

    var SubTotalWeight = 0.0;
    $(subItemsWeight).each(function () {
        myWeightArray.push(parseFloat($(this).text()));
        SubTotalWeight += parseFloat($(this).text());

    });
    alert(myWeightArray.join("\n"));
    $(subTotalWeight).text(SubTotalWeight.toString());

}
// Get the index element in a group of element
 function GetLSElementIndex(ElementGroup, Element) {
    $(ElementGroup).each(function (index) {
        var someText = $(this).attr('id');
        if (someText == Element) {
            alert(someText);
            alert(index);
            //GetLSElementIndex = index;
            //alert(GetLSElementIndex);
            return ;
            //return index;

        }
        

    });

}


// a null signifies separate line segments
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


$(function () {
    //frame = [[10, 22000], [10, 140000], [45, 140000], [45, 22000], [10, 22000]];







    $.plot($("#LoadsheetChart"), [envelope, fuelcurve]);

    var placeholder = $("#LoadsheetChart");

    //var plot = $.plot(placeholder, [d1, d2, d3]);

    // the plugin includes a jQuery plugin for adding resize events to
    // any element, let's just add a callback so we can display the
    // placeholder size
    placeholder.resize(function () {
        $(".message").text("The Chart is now "
                     + $(this).width() + "x" + $(this).height()
                     + " pixels");

    });
});




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
