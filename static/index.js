/**
 * 
 * 
 * @author {John A. Cormican}
 * @author {Manuel Santos Pereira}
 */


/* ============================================= USER ============================================= */

/**
 * Sets a user selected through HTML, forcing a GUI update to show the user's projects.
 * 
 * @param {*} serverAddress address of the server hosting inSPIRE-interact.
 * @param {*} selectedUser user selected by user.
 */
async function selectUser(selectedUser) {
    if (selectedUser === 'exampleUser') {
        var projects = ['exampleProject'];
    } else {
        var projects = [];
    }

    showProjectOptions(projects);
};

async function textSubmit(e, functionActivated) {
    if (e.keyCode !== 13){
        return
    }
    e.preventDefault();

    switch(functionActivated){
        case 'createNewUser':
            createNewUser()
            break;
        case 'createNewProject':
            createNewProject()
            break;
    };

}

/**
 * Creates a new inSPIRE-interact user, forcing a GUI update to show the user's projects.
 * 
 * @param {*} serverAddress address of the server hosting inSPIRE-interact.
 */
async function createNewUser() {
    //Disable the create user button.
    alert('This is a demo site. Creating new users is not possible. Try using the exampleUser.')
};


/* ============================================= PROJECT ============================================= */

/**
 * Updates GUI to display the selected user's projects.
 * 
 * @param {*} options the multiple projects belonging to the selected user.
 */
function showProjectOptions(options) {
    let projectSelection = document.getElementById("project-selection");

    resetSelect(projectSelection);

    options.forEach ((option) => {
        let optionElem = document.createElement('option');
        optionElem.value = option;
        optionElem.innerHTML = option;

        projectSelection.appendChild(optionElem);
    });

    setElementVisibility(["project-select-div"])
};

/**
 * Resets the project selections displayed in the drop-down menu in case the user is re-selected.
 * 
 * @param {HTMLElement} element drop-down menu element containing the projects.
 */
function resetSelect(element) {
    while(element.lastChild.className != "default")
        element.lastChild.remove()
    
    element.selectedIndex = 0;
}

/**
 * Creates a new project for the chosen user, calls the backend services and updates the GUI to reflect the addition.
 * 
 * @param {*} serverAddress  address of the server hosting inSPIRE-interact.
 */
async function createNewProject() {
    alert('This is a demo site. Creating new projects is not possible. Try selecting the example project.')
};

/**
 * Sets a selected project, getting selection from backend.
 * 
 * @param {*} serverAddress address of the server hosting inSPIRE-interact. 
 * @param {*} selectedProject project selected by the user.
 */
async function selectProject() {   
    showWorkflowOptions();
};


/* ============================================= WORKFLOW ============================================= */

/**
 * Updates GUI to display available workflow options.
 */
function showWorkflowOptions() {
    let workflowSelection = document.getElementById("workflow-selection");
    workflowSelection.selectedIndex = 0;
    setElementVisibility(["workflow-select-div"]);
};


/**
 * Sets the selected interact workflow, updating the GUI to reflect the choice.
 * 
 * @param {*} value user's choice of workflow. 
 */
function selectWorkflow(value) {
    switch(value){
        case 'results':
            window.location.href = 'https://quantsysbio.github.io/interact/results.html';
            break;

        case 'inspire':
            window.location.href = 'https://quantsysbio.github.io/interact/usecase.html';
            break;
    };
};

/* ============================================= FUNCTIONAL ============================================= */

async function uploadFiles() {
    alert("This site is for demo purpouses only. Files cannot be uploaded.");
};

function progressHandler(ev) {    
    let totalSize = Math.round((ev.total/1000000000 + Number.EPSILON) * 1000)/1000; // total size of the file in bytes
    let loadedSize = Math.round((ev.loaded/1000000000 + Number.EPSILON) * 1000)/1000; // loaded size of the file in bytes    

    document.getElementById("loaded_n_total").innerHTML = "Uploaded " + loadedSize + " GB of " + totalSize + " GB.";

    // calculate percentage 
    var percent = (ev.loaded / ev.total) * 100;
    document.getElementById("progressBar").style.display="";
    document.getElementById("progressBar").value = Math.round(percent);

};

function checkPreconditions(mode, files) {
    let noFilesText = document.getElementById(mode + "-no-files");

    if(files.length == 0 || (mode == "proteome-select" && (typeof files[0] == "undefined" || typeof files[1] == "undefined"))) {
        noFilesText.style.display = "block";
        return false;
    }

    noFilesText.style.display = "none";
    return true;
}

/**
 * Fetches all files which match a user-specified pattern.
 * 
 * @param {*} serverAddress 
 * @param {*} file_type 
 */
async function checkFilePattern(file_type) {

    if (file_type === 'ms') {
        var filesFound = [
            'WSoh_CBarbosa_170622_240822_Lumos_A25_R1.raw',
            'WSoh_CBarbosa_170622_240822_Lumos_A25_R2.raw',
            'WSoh_CBarbosa_170622_240822_Lumos_A26_R1.raw',
            'WSoh_CBarbosa_170622_240822_Lumos_A26_R2.raw',
            'WSoh_CBarbosa_170622_240822_Lumos_A27_R1.raw',
            'WSoh_CBarbosa_170622_240822_Lumos_A27_R2.raw',
            'WSoh_CBarbosa_170622_240822_Lumos_A28_R1.raw',
            'WSoh_CBarbosa_170622_240822_Lumos_A28_R2.raw',
            'WSoh_CBarbosa_170622_240822_Lumos_A29_R1.raw',
            'WSoh_CBarbosa_170622_240822_Lumos_A29_R2.raw',
            'WSoh_CBarbosa_170622_240822_Lumos_A30_R1.raw',
            'WSoh_CBarbosa_170622_240822_Lumos_A30_R2.raw',
        ];
    } else if (file_type === 'search') {
        var filesFound = [
            '1_DB_search_psm.csv'
        ];
    } else if (file_type === 'proteome') {
        var filesFound = [
            'proteome_combined.fasta', 'host_host_MusMusculus.fasta',
            'pathogen_pathogen_Listeria.fasta',
        ];
    }

    if (file_type !== 'blank') {

        updateListElement(file_type + "-file-list", filesFound);

        if (file_type === 'search') {
            var metaDict = {
                'runFragger': 0,
                'searchEngine': 'peaks',
            };
            if (Object.keys(metaDict).length !== 0) {
                if (metaDict['runFragger'] == 1) {
                    document.getElementById('search-required-selection').value = 'searchNeeded';
                    selectSearchType('searchNeeded')
                } else {
                    selectSearchType('searchDone')
                    document.getElementById('search-required-selection').value = 'searchDone';
                    if ('searchEngine' in metaDict){
                        document.getElementById('search-engine-selection').value = metaDict['searchEngine'];
                        selectSearchEngine(metaDict['searchEngine'])
                    }
                }
            }
        };
    };
}

/**
 * Clear all files which match a user-specified pattern.
 * 
 * @param {*} serverAddress 
 * @param {*} file_type 
 */
async function clearFilePattern() {
    alert("This is a demo site only, can't delete files.");
}


/* ============================================= GUI FUNCTIONS ============================================= */

var lastFrame = "init";
/**
 * Function to asynchronously update GUI after each stage submit.
 * 
 * @param {*} currentFrame frame currently being cycled out of.
 */
async function updateGUI(currentFrame, serverAddress) {
    let blockIds;
    let deletedIds;

    switch(currentFrame){
        case 'ms':
            checkFilePattern('search');
            deletedIds = ["ms-data-div"];
            blockIds = ["search-div"];
            break;

        case 'search':
            deletedIds = ["search-div"];
            blockIds = ["proteome-div"];
            break;

        case 'proteome':
            presentFrame = "configs";
            deletedIds = ["proteome-div"];
            blockIds = ["parameters-div", "execute-button"];
            document.getElementById("forward-button").style.display = 'none';
            break;
        
        case 'proteome-select':
            presentFrame = "configs";
            deletedIds = ["proteome-div"];
            blockIds = ["parameters-div", "execute-button"];
            document.getElementById("forward-button").style.display = 'none';
            break;
    };
    
    setElementDisplay(blockIds);
    setElementDisplay(deletedIds, "none");
    lastFrame = currentFrame;
}

/**
 * Function to revert the GUI to the previous frame.
 * 
 * @param {*} frame frame to be reverted to.
 */
async function revertGUI(frame) {
    switch(frame) {
        case 'usecase':
            window.location.href = 'https://quantsysbio.github.io/interact/interact.html';  
            break;

        case 'ms':
            window.location.href = 'https://quantsysbio.github.io/interact/usecase.html';  
            break;

        case 'search':
            window.location.href = 'https://quantsysbio.github.io/interact/ms.html';  
            break;

        case 'proteome':
            window.location.href = 'https://quantsysbio.github.io/interact/search.html';  
            break;

        case 'parameters':
            window.location.href = 'https://quantsysbio.github.io/interact/proteome.html';  
            break;
    };
}

async function goHome() {
    window.location.href = 'https://quantsysbio.github.io/inspire-interactive.html';
}

async function forwardGUI(frame) {
    switch(frame) {
        case 'usecase':
            window.location.href = 'https://quantsysbio.github.io/interact/ms.html';  
            break;
        case 'ms':
            window.location.href = 'https://quantsysbio.github.io/interact/search.html';
            break;
        case 'search':
            window.location.href = 'https://quantsysbio.github.io/interact/proteome.html';
            break;
        case 'proteome':
            window.location.href = 'https://quantsysbio.github.io/interact/parameters.html';
            break;
    };

}

/**
 * Sets the display of elements with the given ids to the desired displayType.
 * 
 * Defaults to 'block' display.
 * 
 * @param {*} ids ids of elements to affect.
 * @param {*} displayType style type to apply to the desired elements.
 */
function setElementDisplay(ids, displayType = 'block') {
    ids.forEach((id) => {
        document.getElementById(id).style.display = displayType;
    });
}

/**
 * Sets the visibility of elements with the given ids to the desired visibilityType.
 * 
 * Defaults to 'visible' visibility.
 * 
 * @param {*} ids ids of elements to affect.
 * @param {*} visibilityType style type to apply to the desired elements.
 */
function setElementVisibility(ids, visibilityType = 'visible') {
    ids.forEach((id) => {
        document.getElementById(id).style.visibility = visibilityType;
    });
}

/**
 * Updates an HTML list element with an array's elements.
 * 
 * @param {*} listName id of the already-existing list.
 * @param {*} array array to add.
 */
function updateListElement(listName, array) {
    let ul = document.getElementById(listName);
    console.log(Array.from(ul));
    console.log(ul);
    if (Array.from(ul).length === 0) {
        array.forEach ((elem) => {
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(elem));
            ul.appendChild(li);
        });
    
        ul.style.display = 'block';
    }
}


/**
 * Sets the search type according to the user's choice, additionally updating the GUI to reflect the choice.
 * 
 * @param {*} value chosen search type.
 */
function selectSearchType(value) {
    switch(value){
        case 'searchDone':
            setElementDisplay(['search-engine-div']);
            break;
        case 'searchNeeded':
            setElementDisplay(['search-engine-div'], displayType='none');
            break;
    };
};

function selectSearchEngine(value) {
    setElementDisplay([ 'search-column-1', 'search-column-2', 'search-separator']);
};

/**
 * Sets the inspire type according to the user's choice, additionally updating the GUI to reflect the choice.
 * 
 * @param {*} value chosen inspire type.
 */
async function selectInspireType(value) {
    forwardGUI('usecase');
};

/**
 * Provides the link to the download page.
 * 
 * @param {*} message server response to request. 
 */
function makeDownloadVisible(message) {
    let fileDownloadTextElem = document.getElementById("file-download-text")

    if (message.startsWith('inSPIRE-Interact failed')) {
        fileDownloadTextElem.textContent = message;
    } else {   
        let a = document.getElementById('file-download');
        a.href = message;
        a.innerHTML = message;
    }

    fileDownloadTextElem.style.display = "block";
    let loadingElem = document.getElementById("loading-text");
    loadingElem.style.display = "none";
};

/**
 * Cycles the back button's visibility from visible to hidden and vice-versa.
 */
function cycleButtonVisibility(buttonType) {
    let button = document.getElementById(buttonType+"-button")

    button.style.visibility = (button.style.visibility == "visible") ? "hidden" : "visible"
}

/* ============================================= BACKEND ============================================= */

/**
 * Posts the selected files to the backend.
 * 
 * @param {*} serverAddress  address of the server hosting inSPIRE-interact. 
 * @param {*} formData 
 * @param {*} mode 
 * @returns 
 */
async function postFiles(serverAddress, user, project, formData, mode){
    return await fetch(
        'http://' + serverAddress + ':5000/interact/upload/' + user + '/' + project + '/' + mode,
        {
            method: 'POST',
            body: formData,
        }
    ).then( response => {
        return response.json();
    });
}

function controlCheck(col, file_name, item) {
    if (file_name.includes(item) & item !== '') {
        col.getElementsByClassName('infection-checkbox')[0].checked = false;
    }
};

function replicateCheck(col, file_name, item, index) {
    if (item.includes(file_name)) {
        col.getElementsByClassName('sample-value')[0].value = index + 1;
    }
};

async function parametersCheck()
{
    var metaDict = {
        'additionalConfigs': {
            'engineScoreCut': '20.4',
            'remapToProteome': 'True',
        },
        'alleles': 'H-2-Kb',
        'controlFlags': 'WSoh_CBarbosa_170622_240822_Lumos_A28_R1,WSoh_CBarbosa_170622_240822_Lumos_A28_R2,WSoh_CBarbosa_170622_240822_Lumos_A29_R1,WSoh_CBarbosa_170622_240822_Lumos_A29_R2,WSoh_CBarbosa_170622_240822_Lumos_A30_R1,WSoh_CBarbosa_170622_240822_Lumos_A30_R2,',
        'ms1Accuracy': '5',
        'mzAccuracy': '0.02',
        'mzUnits': 'Da',
        'runQuantification': 1,
        'technicalReplicates': [
            ['WSoh_CBarbosa_170622_240822_Lumos_A25_R1', 'WSoh_CBarbosa_170622_240822_Lumos_A25_R2'],
            ['WSoh_CBarbosa_170622_240822_Lumos_A26_R1', 'WSoh_CBarbosa_170622_240822_Lumos_A26_R2'],
            ['WSoh_CBarbosa_170622_240822_Lumos_A27_R1', 'WSoh_CBarbosa_170622_240822_Lumos_A27_R2'],
            ['WSoh_CBarbosa_170622_240822_Lumos_A28_R1', 'WSoh_CBarbosa_170622_240822_Lumos_A28_R2'],
            ['WSoh_CBarbosa_170622_240822_Lumos_A29_R1', 'WSoh_CBarbosa_170622_240822_Lumos_A29_R2'],
            ['WSoh_CBarbosa_170622_240822_Lumos_A30_R1', 'WSoh_CBarbosa_170622_240822_Lumos_A30_R2'],
        ],
        'useBindingAffinity': 'asFeature',
    };

    if ('ms1Accuracy' in metaDict) {
        document.getElementById('ms1-accuracy-input').value = metaDict['ms1Accuracy'];
    }
    if ('mzAccuracy' in metaDict) {
        document.getElementById('ms2-accuracy-input').value = metaDict['mzAccuracy'];
    }
    if ('mzUnits' in metaDict) {
        document.getElementById('ms2-unit-selection').value = metaDict['mzUnits'];
    }
    if ('runQuantification' in metaDict) {
        if (metaDict['runQuantification']){
            document.getElementById('quantification-checkbox').checked = true;
        }
    }
    if ('useBindingAffinity' in metaDict) {
        if (metaDict['useBindingAffinity'] === 'asFeature') {
            document.getElementById('panfeature').checked = true;
            document.getElementById('netmhcpan-allele-div').style.display = 'block';
        } else if (metaDict['useBindingAffinity'] === 'asValidation') {
            document.getElementById('panvalidation').checked = true;
            document.getElementById('netmhcpan-allele-div').style.display = 'block';
        }
    }
    if ('alleles' in metaDict) {
        document.getElementById('netmhcpan-allele-div').style.display = 'block';
        document.getElementById('netmhcpan-allele-input').value = metaDict['alleles'];
    }
    if ('controlFlags' in metaDict) {
        var table = document.getElementById("raw-table");
        var controlFlags = metaDict['controlFlags'].split(",");
        for (var row_idx = 1, row; row = table.rows[row_idx]; row_idx++) {
            file_name = row.cells[0].textContent;
            col = row.cells[2];
            if (typeof col !== "undefined") {
                col.getElementsByClassName('infection-checkbox')[0].checked = true;
                controlFlags.forEach(function (item, _) {
                    controlCheck(col, file_name, item)
                });
            };
        }
    }
    if ('technicalReplicates' in metaDict) {
        var table = document.getElementById("raw-table");
        for (var row_idx = 1, row; row = table.rows[row_idx]; row_idx++) {
            file_name = row.cells[0].textContent;
            col = row.cells[1];
            metaDict['technicalReplicates'].forEach(function (item, index) {
                replicateCheck(col, file_name, item, index)
            });
        }
    }
    if ('additionalConfigs' in metaDict) {
        for (const configKey in metaDict['additionalConfigs']) {
            var table = document.getElementById('configs-table');
            var lastRow = table.rows[ table.rows.length - 1 ];
            lastRow.cells[0].getElementsByClassName('config-key')[0].value = configKey
            lastRow.cells[1].getElementsByClassName('config-value')[0].value = metaDict['additionalConfigs'][configKey];
            addConfigs();
          };
    }
}

/**
 * POSTs JSON data to an Interact endpoint.
 * 
 * @param {*} serverAddress  address of the server hosting inSPIRE-interact. 
 * @param {*} endPoint endpoint to POST to.
 * @param {*} configObject 
 * @returns reponse of the endpoint to the POST request.
 */
async function postJson(serverAddress, endPoint, configObject)
// Function to POST json data to a Interact endpoint.
{
    var response = await fetch(
        'http://' + serverAddress + ':5000/interact/' + endPoint,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                configObject
            )
        },
    ).then( response => {
        return response.json();
    });

    return response;
}

/**
 * Executes the base inSPIRE pipeline at the end of the user-led setup.
 * 
 * @param {*} serverAddress address of the server hosting inSPIRE-interact.
 */
async function cancelPipeline(serverAddress, user, project) {
    var configObject = {
        'user': user,
        'project': project,
    };

    if (confirm("Are you sure you want to delete the project " + project + "?") == true) {
        var response = await postJson(serverAddress, 'cancel', configObject);
        let cancelElem = document.getElementById("cancelled-text")
        cancelElem.innerHTML = response['message'];
    } else {
        let cancelElem = document.getElementById("cancelled-text")
        cancelElem.innerHTML = 'No cancellation.';
    }
};

async function cancelJobById(serverAddress) {
    var configObject = {
        'jobID': document.getElementById('cancel-job-input').value,
    };
    if (confirm("Are you sure you want to cancel execution for job ID " + configObject['jobID'] + "?") == true) {
        var response = await postJson(serverAddress, 'cancel', configObject);
        let cancelElem = document.getElementById("cancel-text")
        cancelElem.innerHTML = response['message'];
    } else {
        let cancelElem = document.getElementById("cancel-text")
        cancelElem.innerHTML = 'No cancellation.';
    }
};

async function downloadOutputs(serverAddress, user, project) {
    var configObject = {
        'user': user,
        'project': project,
    };
    let downloadElem = document.getElementById("download-text");
    downloadElem.innerHTML = 'There may be some delay before your download begins in order to zip the output folder.';
    await postJson(serverAddress, 'download', configObject)
};


async function deleteProject(serverAddress, user, project) {
    var configObject = {
        'user': user,
        'project': project,
    };

    if (confirm("Are you sure you want to delete the project " + project + "?") == true) {
        await postJson(serverAddress, 'cancel', configObject)
        var response = await postJson(serverAddress, 'delete', configObject);
        let deleteElem = document.getElementById("delete-text");
        deleteElem.innerHTML = response['message'];
    } else {
        let deleteElem = document.getElementById("delete-text");
        deleteElem.innerHTML = 'No deletion.';
    } 
};

function constructConfigObject(user, project) {
    let ms1Accuracy = document.getElementById('ms1-accuracy-input').value;
    let mzAccuracy = document.getElementById('ms2-accuracy-input').value;
    let mzUnits = document.getElementById('ms2-unit-selection').value;


    var table = document.getElementById("raw-table");
    var file_name = "";
    var technicalReplicates = Object();
    var controlFlags = "";
    for (var row_idx = 1, row; row = table.rows[row_idx]; row_idx++) {
        for (var col_idx = 0, col; col = row.cells[col_idx]; col_idx++) {
            if (col_idx === 0){
                file_name = col.textContent;
            }
            if (col_idx === 1){
                sample_value = col.getElementsByClassName('sample-value')[0].value;
                if (sample_value in technicalReplicates){
                    technicalReplicates[sample_value].push(file_name);
                } else {
                    technicalReplicates[sample_value] = [file_name];
                }
            }
            if (col_idx === 2){
                if (col.getElementsByClassName('infection-checkbox')[0].checked) {
                    continue
                } else {
                    controlFlags += file_name;
                    controlFlags += ",";
                }
            }
        }  
    }

    var configObject = {
        'user': user,
        'project': project,
        'ms1Accuracy': ms1Accuracy,
        'mzAccuracy': mzAccuracy,
        'mzUnits': mzUnits,
        'controlFlags': controlFlags,
        'technicalReplicates': Object.values(technicalReplicates)
    };


    if (document.getElementById('panfeature').checked){
        configObject['useBindingAffinity'] = 'asFeature';
        configObject['alleles'] =  document.getElementById('netmhcpan-allele-input').value;
    } else if (document.getElementById('panvalidation').checked) {
        configObject['useBindingAffinity'] = 'asValidation';
        configObject['alleles'] =  document.getElementById('netmhcpan-allele-input').value;
    };

    //gets rows of table
    var configTable = document.getElementById('configs-table');
    var rowLength = configTable.rows.length;


    var additionalConfigs = {};
    //loops through rows    
    for (i = 1; i < rowLength; i++){
        //gets cells of current row
        var configCells = configTable.rows.item(i).cells;
        var configKey = configCells[0].children[0].value;
        var configValue = configCells[1].children[0].value;
        if (configKey){
            additionalConfigs[configKey] = configValue;
        }
    }

    configObject['runQuantification'] = (
        document.getElementById('quantification-checkbox'
    ).checked) ? 1 : 0;
    configObject['additionalConfigs'] = additionalConfigs;
    return configObject;
}

async function executePipeline() {

    let paramSaveElem = document.getElementById("params-save-text");
    paramSaveElem.style.display = "none";
    document.getElementById('execute-button').disabled = "disabled";
    
    let loadingElem = document.getElementById("loading-text");
    loadingElem.style.display = "block";

    makeDownloadVisible("https://quantsysbio.github.io/interact/results.html");

};


async function saveParameters() {
    alert("Site is for demonstration only. Parameters not updated.")
};


function deleteRow(r)
// Function to delete a row from the table.
{
    var i = r.parentNode.parentNode.rowIndex;
    document.getElementById("configs-table").deleteRow(i);
};

function competingCheckboxes(checkbox, checkboxClass)
// 
{
    if (checkbox.checked){
        Array.from(
            document.getElementsByClassName(checkboxClass)
        ).forEach((box) => {
            box.checked = false;
        });
        checkbox.checked = true;
        setElementDisplay(['netmhcpan-allele-div']);
    }  else {
        setElementDisplay(['netmhcpan-allele-div'], 'none');
    }
}

/**
 * Adds additional GUI elements for further inSPIRE configurations.
 */
function addConfigs() {
        let newRow = document.getElementById('configs-table').getElementsByTagName('tbody')[0].insertRow();

        let newButton = document.createElement("input");
        newButton.type = "button";
        newButton.value = "Delete Entry";
        newButton.onclick = function() { 
            deleteRow(this);
        };

        const CLASSES = ['config-key', 'config-value']

        for (var i = 0; i < 3; i++) {
            let newCell = newRow.insertCell();
            let newInput = document.createElement("input");
            newInput.type = "text";

            if (i == 2) {
                // ms-data-extra
                newButton.classList.add('ms-data-extra');
                newCell.appendChild(newButton);
            } else {
                newInput.classList.add(CLASSES[i]);
                newCell.appendChild(newInput);
            }
        }
    };