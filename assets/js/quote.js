$(document).ready(function () {
    $("#numElev_2, #numElev_3, #elevPriceUnit, #elevTotal, #installationFee, #total_").attr('readonly', true);

    var numApp, numFloors, numBase, numElev, maxOcc;   //j'ai ajouté numElev qui manquait
    var prodRange = {
        type: null,
        price: null,
        installationFeePercentage: null
    };

    $('.formField').on('keyup', function () {
        doCalc();
    });


    $('#standard, #premium, #excelium').on('click', function () {                       // pour corriger standart
        document.getElementById('elevPriceUnit').value = (12345).toFixed(2) + " $";
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
            prodRange.price = parseFloat(12345);            //pour corriger le 123456 entré ici
            prodRange.installationFeePercentage = 0.13;
            return prodRange;

        } else if ($('#excelium').is(':checked')) {
            prodRange.type = "excelium";
            prodRange.price = parseFloat(15400);
            prodRange.installationFeePercentage = 0.16;
            return prodRange;
        } else {
            prodRange.type = null,
            prodRange.price = null,                       //à enlever ?
            prodRange.installationFeePercentage = null
            return prodRange;
        }
    };

    function GetInfos() {
        getInfoNumApp();                                // ajouter le getInfoNumApp manquant
        getInfoNumFloors();
        getInfoNumBase();
        getInfoNumElev();
        getInfoMaxOcc();
        getProdRange();
    };

    function setRequiredElevatorsResult(finNumElev) {
        $("#numElev_2, #numElev_3").val(parseFloat(finNumElev));   
    };

    function setPricesResults(finNumElev, roughTotal, installFee, total) {     //il manque kekchose pour finNumElev
        $("#elevTotal").val(parseFloat(roughTotal).toFixed(2) + " $");
        $("#installationFee").val(parseFloat(installFee).toFixed(2) + " $");
        $("#total_").val(parseFloat(total).toFixed(2) + " $");
    };

    function emptyElevatorsNumberAndPricesFields() {
        $('#numElev_3').val('');
        $('.priceField').val('');
        $('#numElev_2').val('');            // pour vider le change n. of elevator j'ai ajouté cette ligne
    };

    function createFormData(projectType) {
        return {
            numberApp: numApp,
            numberFloors: numFloors,
            numberBase: numBase,
            numberElev: numElev,            // j'ai ajouté le numElev qui n'était pas là
            maximumOcc: maxOcc,
            productRange: prodRange,
            projectType: projectType
        }
    };

    function negativeValues() {
        if ($('#numApp').val() < 0) {

            alert("Please enter a positive number!");
            $('#numApp').val('');
            return true

        } else if ($('#numFloors').val() < 0) {             // pour corriger l'entrée du chiffre négatif - OK

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
                    setPricesResults(data.finalNumElev, data.subTotal, data.installationFee, data.grandTotal);
                }
            }
        });
    }
    
    function doCalc() {
        if ($('#residential').hasClass('active') && !negativeValues() && $('#numApp').val() && $('#numFloors').val()) {
            apiCall('residential')
        } else if ($('#commercial').hasClass('active') && !negativeValues() && $('#numElev').val()) {   //enlever && $('#numPark').val() car commercial n'en a pas besoin
            apiCall('commercial')
        } else if ($('#corporate').hasClass('active') && !negativeValues() && $('#numFloors').val() && $('#numBase').val() && $('#maxOcc').val()) {
            apiCall('corporate')
        } else if ($('#hybrid').hasClass('active') && !negativeValues() && $('#numFloors').val() && $('#numBase').val() && $('#maxOcc').val()) {    //j'ai ajouté la section hybrid
            apiCall('hybrid')
        } else {
            emptyElevatorsNumberAndPricesFields();
        };
    };
});
