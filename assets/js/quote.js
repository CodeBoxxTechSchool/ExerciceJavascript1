$(document).ready(function () {
    $("#numElev_2, #numElev_3, #elevPriceUnit, #elevTotal, #installationFee, #total_").attr('readonly', true);

    var numApp, numFloors, numBase, maxOcc;
    var prodRange = {
        type: null,
        price: null,
        installationFeePercentage: null
    };

    $('.formField').on('keyup', function () {
        doCalc();
    });
    //10- Clicking on the Standard button does not seem to redo a new calculation --> "t" instead of "d"
    $('#standard, #premium, #excelium').on('click', function (){
        document.getElementById('elevPriceUnit').value = (7565).toFixed(2) + " $";
        doCalc();
    });

    $('#residential, #commercial, #corporate, #hybrid').on('click', function () {
        initialize();
    });


    function initialize() {
        $('.formField').val('');
        $('.productRangeBtn').prop('checked', false);
    };

    function getInfoNumApp() {
        numApp = $('#numApp').val();
    };

    function getInfoNumFloors() {
        numFloors = $('#numFloors').val();
    };

    function getInfoNumBase() {
        numBase = $('#numBase').val();
    };

    function getInfoNumElev() {
        numElev = $('#numElev').val();
    };

    function getInfoMaxOcc() {
        maxOcc = $('#maxOcc').val();
    };

    function getProdRange() {
        if ($('#standard').is(':checked')) {
            prodRange.type = "standard";
            prodRange.price = parseFloat(7565);
            prodRange.installationFeePercentage = 0.1;
            return prodRange;

        } else if ($('#premium').is(':checked')) {
            prodRange.type = "premium";
            prodRange.price = parseFloat(12345); //9- A calculation with the Premium option gives an incorrect price --> it was an extra "6" in the end of the line
            document.getElementById('elevPriceUnit').value = (12345).toFixed(2) + " $"; //1- The "Unit Price" field displays only the price of the Standard range
            prodRange.installationFeePercentage = 0.13;
            return prodRange;

        } else if ($('#excelium').is(':checked')) {
            prodRange.type = "excelium";
            prodRange.price = parseFloat(15400);
            document.getElementById('elevPriceUnit').value = (15400).toFixed(2) + " $"; //1- The "Unit Price" field displays only the price of the Standard range
            prodRange.installationFeePercentage = 0.16;
            return prodRange;
        } else {
            prodRange.type = null,
            prodRange.price = null,
            prodRange.installationFeePercentage = null
            return prodRange;
        }
    };

    function GetInfos() {
        getInfoNumApp(); //4- The Residential calculation displays "NaN" --> add getInfoNumApp();
        getInfoNumFloors();
        getInfoNumBase();
        getInfoNumElev();
        getInfoMaxOcc();
        getProdRange();
    };

    function setRequiredElevatorsResult(finNumElev) {
        $("#numElev_2, #numElev_3").val(parseFloat(finNumElev));
    };

    function setPricesResults(finNumElev, roughTotal, installFee, total) {
        $("#elevTotal").val(parseFloat(roughTotal).toFixed(2) + " $");
        $("#installationFee").val(parseFloat(installFee).toFixed(2) + " $");
        $("#total_").val(parseFloat(total).toFixed(2) + " $");
    };

    function emptyElevatorsNumberAndPricesFields() {
        $('#numElev_2').val('');  //3- The "N. of Elevator" field is not deleted when a mandatory field is deleted
        $('#numElev_3').val('');
        $('.priceField').val('');
    };

    function createFormData(projectType) {
        return {
            numberApp: numApp,
            numberFloors: numFloors,
            numberBase: numBase,
            maximumOcc: maxOcc,
            productRange: prodRange,
            projectType: projectType,
            numberElev: numElev,
        }
    };

    function negativeValues() {
        if ($('#numApp').val() < 0) {

            alert("Please enter a positive number!");
            $('#numApp').val('');
            return true

        } 
        //3- You can enter a negative number in the "N. of Floors" field --> add this lines with numFloors
        else if ($('#numFloors').val() < 0) {

            alert("Please enter a positive number!");
            $('#numFloors').val('');
            return true

        } else if ($('#numBase').val() < 0) {

            alert("Please enter a positive number!");
            $('#numBase').val('');
            return true

        } else if ($('#numComp').val() < 0) {

            alert("Please enter a positive number!");
            $('#numComp').val('');
            return true

        } else if ($('#numPark').val() < 0) {

            alert("Please enter a positive number!");
            $('#numPark').val('');
            return true

        } else if ($('#numElev').val() < 0) {

            alert("Please enter a positive number!");
            $('#numElev').val('');
            return true

        } else if ($('#numCorpo').val() < 0) {

            alert("Please enter a positive number!");
            $('#numCorpo').val('');
            return true

        } else if ($('#maxOcc').val() < 0) {

            alert("Please enter a positive number!");
            $('#maxOcc').val('');
            return true
        } else {
            return false
        }
    };

    function apiCall(projectType) {
        //Getting numbers from quote
        GetInfos();

        //Preparing data for Api call
        formData = createFormData(projectType)

        $.ajax({
            type: "POST",
            // url: 'http://localhost:3000/api/quoteCalculation/', //for local testing
            url: 'https://rocketelevators-quote.herokuapp.com/api/quoteCalculation/',
            data: JSON.stringify(formData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                setRequiredElevatorsResult(data.finalNumElev);
                if (prodRange.type != null) {
                    setPricesResults(data.subTotal, data.installationFee, data.grandTotal);
                }
            }
        });
    }
    
    function doCalc() {
        if ($('#residential').hasClass('active') && !negativeValues() && $('#numApp').val() && $('#numFloors').val()) {
            apiCall('residential')
        } else if ($('#commercial').hasClass('active') && !negativeValues() && $('#numElev').val()) {
            apiCall('commercial')
        } else if ($('#corporate').hasClass('active') && !negativeValues() && $('#numFloors').val() && $('#numBase').val() && $('#maxOcc').val()) {
            apiCall('corporate') //7- The Corporate calculation displays "NaN"
        } else if ($('#hybrid').hasClass('active') && !negativeValues() && $('#numFloors').val() && $('#maxOcc').val()) {
            apiCall('hybrid') //8- Hybrid calculation does not work at all ---> add this line with the right condition
        } else {
            emptyElevatorsNumberAndPricesFields();
        };
    };
});
