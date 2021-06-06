const deptElement = document.getElementById("dept");
const subCodesElement = document.getElementById("subCode");
const yearElement = document.getElementById("year");
const errElement = document.getElementById("errMessage");
const uploadMessageElement = document.getElementById("uploadMessage")
const form = document.getElementById('form');

var d = new Date();

const subCodes = {
    "ec": ["Sample", "Sample", "Sample2", "AAA", "EC6502"],
    "ee": ["Sample", "Sample2"],
    "cs": ["Sample", "Sample2"],
    "me": ["Sample", "Sample2"],
    "ce": ["Sample", "Sample2"]
}

function deptChange(e) {
    subCodesElement.innerHTML = '';
    let department = deptElement.value;
    
    let option = document.createElement('option');
    option.text = "--Select one--";
    option.value = "none";
    subCodesElement.append(option);

    let subjectCodes = subCodes[department].sort();

    for(let i = 0; i < subjectCodes.length; i++) {
        let option = document.createElement('option');
        option.text = subjectCodes[i];
        option.value = subjectCodes[i];
        subCodesElement.append(option);
    }
}

const checkInputs = () => {
    if (deptElement.value == "none" || subCodesElement.value == "none" || yearElement.value == "none") {
        alert("Invalid year or department or subject code");
        return false;
    }
    return true;
}

const checkTime = () => {
    console.log("Checking the time");
    if (!(d.getHours() >= 13 && d.getHours() <= 14 || d.getHours() >= 18 && d.getHours() <= 22)) {
        errElement.style.display = "block";
        enabled = false;
        return false;
    }
    return true;
}

form.addEventListener('submit', e => {
    e.preventDefault();
    
    console.log(checkInputs());

    if (!checkInputs()) {
        return;
    }   

//     if (!checkTime()) {
//         alert("Answer Submission Time exceeded! Contact your Supervisor");
//         return;
//     }
    const file = form.file.files[0];
    const fr = new FileReader();
    var d = new Date();

    try {
        fr.readAsArrayBuffer(file);
    } catch(err) {
        alert("Please make sure you selected the correct file or contact your supervisor");
        uploadMessageElement.innerHTML = 'UPLOADED SUCCESSFULLY';
        uploadMessageElement.style.display = 'block';
    }

    fr.onload = f => {
        
        uploadMessageElement.innerHTML = "Uploading... Please Wait!"
        uploadMessageElement.style.display = 'block';

        let fileName = form.filename.value + "-" + form.subCode.value + "-" + file.name;

        let url = "https://script.google.com/macros/s/AKfycbyXOKz_8pCY_u5a4D7pok6O8t8aYgpUHZmpMPGcXaQog_5zVRwOXP8qk8yywtgGIYuuUA/exec";

        if (deptElement.value == "ec") {
            url = "https://script.google.com/macros/s/AKfycbzkSqubi0mYTCvkaV-jp0Dpz_KPmq9ZoDDjNJ_8DV09WkdUKGPwawHHeXyfplKI9mUcQg/exec";
        }
        const qs = new URLSearchParams({filename: fileName, mimeType: file.type, subCode: form.subCode.value});
        console.log(`${url}?${qs}`);
        fetch(`${url}?${qs}`, {method: "POST", body: JSON.stringify([...new Int8Array(f.target.result)])})
        .then(res => res.json())
        .then(e => {
            console.log(e);
            alert("File uploaded successfully!");
            form.reset();
            uploadMessageElement.innerHTML = 'UPLOADED SUCCESSFULLY';
            uploadMessageElement.style.display = 'block';
        })  // <--- You can retrieve the returned value here.
        .catch(err => {
            console.log(err);
            uploadMessageElement.innerHTML = 'UPLOADING FAILED';
            uploadMessageElement.style.display = 'block';
            alert("Something went Wrong! Please Try again!");
        });
    }
});
