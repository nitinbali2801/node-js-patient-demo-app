const express = require('express');
const fetch = require('node-fetch');
const app= express();
const path = require('path');

const ONE_UP_PATIENT_URL = 'https://api.1up.health/fhir/dstu2/Patient/';
const HTTP_PORT = 3000
const RESPONSE_OK = 'OK'

app.listen(HTTP_PORT, () => console.log('Listening on port : ' + HTTP_PORT));

// api calls here

// Webpage Route
app.get('/',(req,res) => {
	res.sendFile(path.join(__dirname + '/main.html'));
});

// GET API for retrieving patient health data
app.get('/patientinfo/:accesstoken', fetchDataFromToken);


function fetchDataFromToken(req, res){


	const patientInfoPromise = getRequest(ONE_UP_PATIENT_URL, req.params.accesstoken);
 	
	// resolving promise here
  	const jsonDataPromise = patientInfoPromise.then((httpresponse)=> {
		return httpresponse.json();
	});


  	// resolving promise here
	const patientIdPromise = jsonDataPromise.then((jsonData) => {

		var response = {};

		// handling case where we do not get the response back from 1UP health
		if (jsonData.error != null || jsonData.entry.length == 0) {
			response = {
				"description": jsonData.error_description,
  				"status": jsonData.error || 'Something went wrong'
			}
		}
		else {
			response = {
				"status": RESPONSE_OK,
				"patientId": jsonData.entry[0].resource.id
			}
		}

		return response
	});


	const patientDataPromise = patientIdPromise.then((patient_id_response) => {

		// console.log(patient_id_response);

		if (patient_id_response.status != RESPONSE_OK) {
			res.status(400);
			res.send(patient_id_response.description);
		} else {

			patient_id = patient_id_response.patientId;

			// query patient everything API
			const api_url_1uphealth = 'https://api.1up.health/fhir/dstu2/Patient/' + patient_id + '/$everything';

			const patientDetailsPromise = getRequest(api_url_1uphealth, req.params.accesstoken);

	  		const patientjsonPromise = patientDetailsPromise.then((response)=> {

				return response.json();
			})

	  		const patientDetails = patientjsonPromise.then((jsonData) => {
	  			// console.log(jsonData);
	  			var responseData = {};
	  			var dataArray = [];

	  			for (var i = 0; i < jsonData.entry.length; i++ ) {
	  				
	  				responseData = {
	  					"id": jsonData.entry[i].resource.id,
	  					"resourceType": jsonData.entry[i].resource.resourceType,
	  					"status": jsonData.entry[i].resource.status,
	  					"criticality": jsonData.entry[i].resource.criticality,
	  					"recordedDate": jsonData.entry[i].resource.recordedDate
	  				}
		  			
		  			dataArray.push(responseData);
				}

	  			var finalData = {
	  				records: dataArray,
	  				status: 'OK'
	  			};

	  			// sending data back to the client
				res.send(dataArray);


			}).catch((error) => {
				console.error('Error:', error);
				res.status(500);
				res.send('Something went wrong, contact service owner');
			});
		}
		
	})
}

// send GET request using fetch, returns a promise
function getRequest(URL, accesstoken){

	// sending get request to 1UP health to get the data
	const promise = fetch(URL, {
    	method: 'GET', // *GET, POST, PUT, DELETE, etc.
    	mode: 'no-cors', // no-cors, *cors, same-origin
	    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
	    credentials: 'same-origin', // include, *same-origin, omit
	    headers: {
	      'Content-Type': 'application/json',
	      'Authorization':'Bearer ' + accesstoken
	      // 'Content-Type': 'application/x-www-form-urlencoded',
	    },
	    redirect: 'follow', // manual, *follow, error
	    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  	});

  	return promise;

}



