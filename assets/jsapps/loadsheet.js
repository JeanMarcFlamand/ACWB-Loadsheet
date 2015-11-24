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

        // Do sub total of Operating items weight
        
        CalcItemsWeight("[id*='Crews_Weight']", "[id='W_OP_CrewsItems']");
        CalcItemsWeight("[id*='G1_Weight']", "[id='W_OP_G1Weight']");
        CalcItemsWeight("[id*='CAB1_Weight']", "[id='W_OP_CABWeight']");

        // Do operating weight items total
        CalcSubTotalWeight("[id*='W_OP_']", "[id='W_OWE_OPTotalOPWeight']");

        // Do OWE (Operating Weight Empty) calcs
        CalcSubTotalWeight("[id*='W_OWE_']", "[id='W_ZFW_OWE']");

        // Do sub total payload
        CalcItemsWeight("[id*='Pax_Weight']", "[id='W_PL_PAX']");
        CalcItemsWeight("[id*='Cargo1_Weight']", "[id='W_PL_Cargo1']");

        // Do Payload Weight total
        CalcSubTotalWeight("[id*='W_PL_']", "[id='W_ZFW_PLTotalWeight']");

        // Do ZFW (Zero Fuel_Weight) calc
        CalcSubTotalWeight("[id*='W_ZFW_']", "[id='W_RW_ZFWTotalWeight']");

        // Do total Fuel Weight
        CalcItemsWeight("[id*='Fuel_Weight']", "[id='W_RW_Fuel']");

        // Do RW (Ramp Weight) calc
        CalcSubTotalWeight("[id*='W_RW_']", "[id='W_RWTotalWeight']");

        //calc
       SubStractWeight("#W_RWTotalWeight", "#TXFuel_Weight2");

     // alert( $("#W_RWTotalWeight").text());
      


    });

    function SubStractWeight(weight1, weight2) {
        var tempweight1 = 0.0;
        var tempweight2 = 0.0;
        var tempweight3 = 0.0;
        alert($(weight1).text());
        alert($(weight2).val());
        //tempweight = $(weight1).text().parseFloat - $(weight2).val().parseFloat ;
        tempweight1 = $(weight1).text().parseFloat;
        tempweight2 = $(weight2).val().parseFloat;
        tempweight3 = tempweight1 - tempweight2;
        alert(tempweight1.toString());
        alert(tempweight2.toString());
        alert(tempweight3.toString());

   }
  
    function CalcItemsWeight(Items, Total) {
        var SubTotalWeight = 0.0;
        $(Items).each(function () {
            SubTotalWeight += parseFloat(this.value);
        });
        
        $(Total).text(SubTotalWeight.toString());

    }

    function CalcSubTotalWeight(subItems, subTotal) {
        var SubTotalWeight = 0.0;
        $(subItems).each(function () {
            SubTotalWeight += parseFloat($(this).text());
        });

        $(subTotal).text(SubTotalWeight.toString());

    }


    $(function () {
               //frame = [[10, 22000], [10, 140000], [45, 140000], [45, 22000], [10, 22000]];
        var envelope = [[20, 71700], [20, 98000], [28, 129700], [38, 129700], [38, 119840], [43, 102200], [43, 94000], [34, 71700], [20, 71700]];
         

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





        $.plot($("#LoadsheetChart"), [envelope, fuelcurve]);

        //var placeholder = $("#placeholder");

        //var plot = $.plot(placeholder, [d1, d2, d3]);

        // the plugin includes a jQuery plugin for adding resize events to
        // any element, let's just add a callback so we can display the
        // placeholder size
        LoadsheetChart.resize(function () {
            $(".message").text("The Chart is now "
                         + $(this).width() + "x" + $(this).height()
                         + " pixels");
        });
    });

   


    function  handleFileSelect() {
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
        alert(mydb.Envelopes.Envelpope_ID[2])
        alert(mydb.Envelopes.CG_MAC[2]);
        alert(mydb.Envelopes.Weight_Imp[2]);
        
        alert(envelope.lenght);
    }
