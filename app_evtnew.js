
//Getting var from ids
var form = document.querySelector('#designNew');
var sD = document.querySelector('#status');
var iD = document.querySelector('#tDisplay');
var rD = document.querySelector('#rDisplay');
var rdown = document.querySelector('#report');


form.addEventListener('submit', (e)=>{
    e.preventDefault();
    //Values extraction from form
    var frate = form.elements.frate.value;
    var eps = form.elements.eps.value;
    var ftp = form.elements.ftp.value;
    var icom = form.elements.icom.value;
    var fcom = form.elements.fcom.value;
    var htc = form.elements.htc.value;
    var stp = form.elements.stp.value;
    var ptype = form.elements.ptype.value;
    var etl = form.elements.etl.value;
    var eps1 = eps;
    var stp1 = stp;
    //Calculated L and V

    var l = Math.ceil(frate*(icom/fcom)) -1;
    var v = frate-l;

    //Pressure converted from atm to kpa
    eps = eps*101.325;
    stp = stp*101.325;

    //Fixed values of tube diameter
    var dout = 0.0508;
    var di = 0.0447;

    //Extraction from steam table

    var hf = (4.30173*ftp) - 7.23119;
    var hl = 269.302*(Math.pow(eps,0.18998)) - 231.283;
    var hv = 1443.32*(Math.pow(eps,0.0241518)) + 1064.22;
    var ls = 2235;
    var tf ;
    var ts ;
//7.1372
//2236.85

    if(stp<=125){
        ts = 111.528*(Math.pow(stp,0.12989)) - 104.564;
    }
    else{
        ts = 65.9499*(Math.pow(stp,0.186755))- 59.2519;
    }

    if(eps<=125){
        tf = 111.528*(Math.pow(eps,0.12989)) - 104.564;
    }
    else{
        tf = 65.9499*(Math.pow(eps,0.186755))- 59.2519;
    }

    if(stp<=1500){
        ls = 2566.8 - 91.8525*(Math.pow(stp,0.260384));
    }
    else{
        ls = 2711.16 - 226.526*(Math.pow(stp,0.14804));
    }


    //Main calculations

    var srate = (v*hv + l*hl - frate*hf)/ls;
    srate = Math.ceil(srate) + 1;
    var q = srate*ls;
    var area = q/((ts-tf)*htc);
    area= Math.ceil(area);
    var ntube = area/(3.14*dout*etl);
    ntube = Math.ceil(ntube);
    var pt = 1.25*dout;
    var a1;
    var a2;
    var a3;

    if(ptype=='triangle'){
        ntube = ntube + (3- (ntube%3));
        a1 = ntube*0.866*pt*pt;
    }
    else{
        ntube = ntube + (4- (ntube%4));
        a1 = ntube*pt*pt;
    }

    a2 = 0.11*a1;
    a3 = 0.4*ntube*0.785*di*di;

    var atotal = a1+a2+a3;
    var dc = Math.pow(1.2738*atotal,0.5);
    dc *=100;
    dc = Math.ceil(dc);
    dc /=100;

    //DOM
    sD.innerHTML = `<b>Status : </b> <span>Success! <i style="color:green" class="fas fa-check-circle"></i></span>`;

    rD.innerHTML = `<div class="col-12">Input Table</div>
    <div class="col-12 row justify-content-center align-items-center">
        <table class="p-4 col-md-7" border="1px" style="background-color: white;">
            <tr class="bg-primary" style="color: white;">
                <td>
                    Property
                </td>
                <td>
                    Value
                </td>
            </tr>
            <tr>
                <td>
                    Feed FlowRate (Kg/hr)
                </td>
                <td>
                    ${frate}
                </td>
            </tr>
            <tr>
                <td>
                    Operating Pressure (atm)
                </td>
                <td>
                    ${eps1}
                </td>
            </tr>
            <tr>
                <td>
                    Feed Temp (°C)
                </td>
                <td>
                    ${ftp}
                </td>
            </tr>
            <tr>
                <td>
                    Initial Composition
                </td>
                <td>
                    ${icom}
                </td>
            </tr>
            <tr>
                <td>
                     Final Composition
                </td>
                <td>
                    ${fcom}
                </td>
            </tr>
            <tr>
                <td>
                    HT Coefficient (KJ/hKm2)
                </td>
                <td>
                    ${htc}
                </td>
            </tr>
            <tr>
                <td>
                     Steam Pressure (atm)
                </td>
                <td>
                    ${stp1}
                </td>
            </tr>
            <tr>
                <td>
                     Pitch Type
                </td>
                <td>
                    ${ptype}
                </td>
            </tr>
            <tr>
                <td>
                     Tube length (m)
                </td>
                <td>
                    ${etl}
                </td>
            </tr>
        </table>
        <img src="evd.gif" class="col-md-5">
    </div>`;
    //Results display
    atotal *=100;
    atotal = Math.ceil(atotal);
    atotal /=100;
    var el = 3*etl;
    el *=10;
    el = Math.ceil(el);
    el /=10;
    iD.innerHTML = `<div class="col-12">Results:</div>
    <div class="col-12 row justify-content-center">
        <table class="p-4" border="1px" style="background-color: white;">
            <tr class="bg-primary" style="color: white;">
                <td>
                    Property
                </td>
                <td>
                   Required Value
                </td>
            </tr>
            <tr>
                <td>
                    Steam FlowRate (Kg/hr)
                </td>
                <td>
                    ${srate}
                </td>
            </tr>
            <tr>
                <td>
                    Number Of Tubes
                </td>
                <td>
                    ${ntube}
                </td>
            </tr>
            <tr>
                <td>
                    Total Area (m^2)
                </td>
                <td>
                    ${atotal}
                </td>
            </tr>
            <tr>
                <td>
                    Diameter Required (m)
                </td>
                <td>
                    ${dc}
                </td>
            </tr>
            <tr>
                <td>
                     Evaporator Length (m)
                </td>
                <td>
                    ${el}
                </td>
            </tr>
        </table>
    </div>`;
    rdown.innerHTML = `<button class='col-10 col-md-6 btn btn-primary' onclick="saveDiv('tDisplay','Title')">Save Report</button>`;


})

var doc = new jsPDF();

 function saveDiv(divId, title) {
 doc.fromHTML(`<html><head><meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <script src="https://kit.fontawesome.com/93fd6bbb87.js" crossorigin="anonymous"></script>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.4/jspdf.min.js"></script>
 <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700">
 <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
     integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
 <link rel="stylesheet" href="app.css"><title>${title}</title></head><body>` + document.getElementById(divId).innerHTML + `</body></html>`);
 doc.save('nitwlab_report.pdf');
}
