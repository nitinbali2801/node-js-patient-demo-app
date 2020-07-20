The assignment is a  web application that uses 1upHealth API to get the patient's data using the FHIR $everything query for a user from an Electronic Health Record Vendor. 
This application will accept an access token and will display the result in the human readable format.

### How to run :
Assumptions : 
1) Node already installed in the system.
2) A browser is installed on the system.
3) You have already gotten the files required to run the application. 

0. From the application folder, run `npm install`.
1. From the folder, Initiate the server with the following command on the terminal -- `npm start`
2. Once the server is running, go to `http://localhost:3000/` in a web browser.
3. Enter the access token on the page and click Submit button, the results will be displayed in a tabular form.
4. Invalid input will cause an alert text to show on the page.

### How it works/High Level Approach
1. Hosted a node js server using express
2. When the user inputs a correct access token, the application sends a GET request with the access token to the node server .
3. The server parses the URL, extracts access token and uses it to send a GET request to 1UpHealth API to extract patient id. 
4. Using this patient id, the server generates another GET request to 1upHealth API with $everything query to get the result of the patient.
5. We parse the JSON to extract the useful fields and display it on the browser in a human readable tabular form.

### Challenges faced
1. Figuring out patient id was a task as i had to iterate repeatedly through the documentation.
2. It's been a while I had worked on web technologies like node, so it took a while to get myself familiar with it.
3. Upon initial reading of the API documentation, i didn't anticipate that pagination was to be done. It took me till sunday evening to figure out this complexity so I was not able to implement pagination considering the deadline in mind. 

### Future Scope

1. I would have liked to paginate over the bundle to get additional resources.
2. Making a React.js web based application for better user interface.
3. The solution can be deployed to AWS or Azure for easy public access.
