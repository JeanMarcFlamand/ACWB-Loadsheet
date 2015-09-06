// JavaScript source code

       $('.row .btn').on('click', function (e) {
           e.preventDefault();
           var $this = $(this);
           var $collapse = $this.closest('.collapse-group').find('.collapse');
           $collapse.collapse('toggle');
       });
          
  

    $(function () {
        //var d1 = [];
        //for (var i = 0; i < 14; i += 0.5)
        //    d1.push([i, Math.sin(i)]);

        //var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];
        //var d3 = [[0, 12], [7, 12], null, [7, 2.5], [12, 2.5]];
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

      

    // ref http://jsfiddle.net/0GiS0/nDVYd/

 //   LoadAirplanesData = function(){
    window.onload = function () {
        //Check File API support
        if (window.File && window.FileList && window.FileReader) {
            var filesInput = document.getElementById("files");

            filesInput.addEventListener("change", function (event) {

                var files = event.target.files; //FileList object
                var output = document.getElementById("result");
                
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    
                    //Only plain text


                    var picReader = new FileReader();

                    picReader.addEventListener("load", function (event) {

                        var textFile = event.target;
                        

                        var div = document.createElement("div");

                        div.innerText = textFile.result;
                        output.insertBefore(div, null);
                        var myDB = JSON.parse(textFile);

                        alert(mydb.GrossWeight[2]);
                    });


                    //Read the text file
                    picReader.readAsText(file);
                    
                }

            });
        }
        else {
            console.log("Your browser does not support File API");
        }
    }
