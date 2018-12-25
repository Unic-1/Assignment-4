/*
 * Frontend Logic for application
 *
 */

// Container for frontend application
var app = {};

// Config
app.config = {
  'sessionToken' : false
};

// AJAX Client (for RESTful API)
app.client = {}

// Interface for making API calls
app.client.request = function(headers,path,method,queryStringObject,payload,callback){

  // Set defaults
  headers = typeof(headers) == 'object' && headers !== null ? headers : {};
  path = typeof(path) == 'string' ? path : '/';
  method = typeof(method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
  queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
  payload = typeof(payload) == 'object' && payload !== null ? payload : {};
  callback = typeof(callback) == 'function' ? callback : false;

  // For each query string parameter sent, add it to the path
  var requestUrl = path+'?';
  var counter = 0;
  for(var queryKey in queryStringObject){
     if(queryStringObject.hasOwnProperty(queryKey)){
       counter++;
       // If at least one query string parameter has already been added, preprend new ones with an ampersand
       if(counter > 1){
         requestUrl+='&';
       }
       // Add the key and value
       requestUrl+=queryKey+'='+queryStringObject[queryKey];
     }
  }

  // Form the http request as a JSON type
  var xhr = new XMLHttpRequest();
  xhr.open(method, requestUrl, true);
  xhr.setRequestHeader("Content-type", "application/json");

  // For each header sent, add it to the request
  for(var headerKey in headers){
     if(headers.hasOwnProperty(headerKey)){
       xhr.setRequestHeader(headerKey, headers[headerKey]);
     }
  }

  // If there is a current session token set, add that as a header
  if(app.config.sessionToken){
    xhr.setRequestHeader("token", app.config.sessionToken.tokenId);
  }

  // When the request comes back, handle the response
  xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE) {
        var statusCode = xhr.status;
        var responseReturned = xhr.responseText;

        // Callback if requested
        if(callback){
          try{
            var parsedResponse = JSON.parse(responseReturned);
            callback(statusCode,parsedResponse);
          } catch(e){
            callback(statusCode,false);
          }

        }
      }
  }

  // Send the payload as JSON
  var payloadString = JSON.stringify(payload);
  xhr.send(payloadString);

};

// Bind the logout button
app.bindLogoutButton = function(){
  document.getElementById("logoutButton").addEventListener("click", function(e){

    // Stop it from redirecting anywhere
    e.preventDefault();

    console.log('Logout unknown 5');
    // Log the user out
    app.logUserOut();

  });
};

// Log the user out then redirect them
app.logUserOut = function(redirectUser){
  // Set redirectUser to default to true
  redirectUser = typeof(redirectUser) == 'boolean' ? redirectUser : true;

  console.log(app.config.sessionToken);
  // Get the current token id
  var tokenId = typeof(app.config.sessionToken.tokenId) == 'string' ? app.config.sessionToken.tokenId : false;

  // Send the current token to the tokens endpoint to delete it
  var queryStringObject = {
    'id' : tokenId
  };
  console.log('Logging out user');
  app.client.request(undefined,'token','DELETE',queryStringObject,undefined,function(statusCode,responsePayload){
    // Set the app.config token as false
    app.setSessionToken(false);

    // Send the user to the logged out page
    if(redirectUser){
      window.location = '/session/deleted';
    }

  });
};

// Bind the forms
app.bindForms = function(){
  if(document.querySelector("form")){

    var allForms = document.querySelectorAll("form");
    for(var i = 0; i < allForms.length; i++){
        allForms[i].addEventListener("submit", function(e){

        // Stop it from submitting
        e.preventDefault();
        var formId = this.id;
        console.log('FORM ID', formId);
        var path = this.action;
        var method = this.method.toUpperCase();

        // Hide the error message (if it's currently shown due to a previous error)
        document.querySelector("#"+formId+" .formError").style.display = 'none';

        // Hide the success message (if it's currently shown due to a previous error)
        if(document.querySelector("#"+formId+" .formSuccess")){
          document.querySelector("#"+formId+" .formSuccess").style.display = 'none';
        }


        // Turn the inputs into a payload
        var payload = {};
        var elements = this.elements;
        for(var i = 0; i < elements.length; i++){
          if(elements[i].type !== 'submit'){
            // Determine class of element and set value accordingly
            var classOfElement = typeof(elements[i].classList.value) == 'string' && elements[i].classList.value.length > 0 ? elements[i].classList.value : '';
            var valueOfElement = elements[i].type == 'checkbox' && classOfElement.indexOf('multiselect') == -1 ? elements[i].checked : classOfElement.indexOf('intval') == -1 ? elements[i].value : parseInt(elements[i].value);
            var elementIsChecked = elements[i].checked;
            // Override the method of the form if the input's name is _method
            var nameOfElement = elements[i].name;
            if(nameOfElement == '_method'){
              method = valueOfElement;
            } else {
              // Create an payload field named "method" if the elements name is actually httpmethod
              if(nameOfElement == 'itemList'){
                nameOfElement = 'method';
              }
              // Create an payload field named "id" if the elements name is actually uid
              if(nameOfElement == 'uid'){
                nameOfElement = 'id';
              }
              // If the element has the class "multiselect" add its value(s) as array elements
              if(classOfElement.indexOf('multiselect') > -1){
                if(elementIsChecked){
                  payload[nameOfElement] = typeof(payload[nameOfElement]) == 'object' && payload[nameOfElement] instanceof Array ? payload[nameOfElement] : [];
                  payload[nameOfElement].push(valueOfElement);
                }
              } else {
                payload[nameOfElement] = valueOfElement;
              }

            }
          }
        }

        // If the method is DELETE, the payload should be a queryStringObject instead
        var queryStringObject = method == 'DELETE' ? payload : {};

        // Call the API
        app.client.request(undefined,path,method,queryStringObject,payload,function(statusCode,responsePayload){
          // Display an error on the form if needed
          if(statusCode !== 200){

            if(statusCode == 403){
              // log the user out
        console.log('Logout unknown 403');
              app.logUserOut();

            } else {

              // Try to get the error from the api, or set a default error message
              var error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';

              // Set the formError field with the error text
              document.querySelector("#"+formId+" .formError").innerHTML = error;

              // Show (unhide) the form error field on the form
              document.querySelector("#"+formId+" .formError").style.display = 'block';
            }
          } else {
            // If successful, send to form response processor
            app.formResponseProcessor(formId,payload,responsePayload);
          }

        });
      });
    }
  }
};

// Form response processor
app.formResponseProcessor = function(formId,requestPayload,responsePayload){
  var functionToCall = false;
  // If account creation was successful, try to immediately log the user in
  if(formId == 'accountCreate'){
    // Take the phone and password, and use it to log the user in
    var newPayload = {
      'email' : requestPayload.email,
      'password' : requestPayload.password
    };

    app.client.request(undefined,'token','POST',undefined,newPayload,function(newStatusCode,newResponsePayload){
      // Display an error on the form if needed
      if(newStatusCode !== 200){

        // Set the formError field with the error text
        document.querySelector("#"+formId+" .formError").innerHTML = 'Sorry, an error has occured. Please try again.';

        // Show (unhide) the form error field on the form
        document.querySelector("#"+formId+" .formError").style.display = 'block';

      } else {
        // If successful, set the token and redirect the user
        app.setSessionToken(newResponsePayload);
        window.location = '/cart/all';
      }
    });
  }
  // If login was successful, set the token in localstorage and redirect the user
  if(formId == 'sessionCreate'){
    app.setSessionToken(responsePayload);
    window.location = '/cart/all';
  }

  // If forms saved successfully and they have success messages, show them
  var formsWithSuccessMessages = ['cartEdit', 'accountEdit2','checksEdit1'];
  if(formsWithSuccessMessages.indexOf(formId) > -1){
    document.querySelector("#"+formId+" .formSuccess").style.display = 'block';
  }

  // If the user just deleted their account, redirect them to the account-delete page
  if(formId == 'accountEdit3'){
    app.logUserOut(false);
    window.location = '/account/deleted';
  }

  // If the user just created a new check successfully, redirect back to the dashboard
  if(formId == 'cartCreate'){
    window.location = '/cart/all';
  }

  // If the user just deleted a check, redirect them to the dashboard
  if(formId == 'cartDelete'){
    window.location = '/cart/all';
  }

  // If the payment is made
  if(formId == 'paymentForm') {
    window.location = '/cart/all';
  }

};

// Get the session token from localstorage and set it in the app.config object
app.getSessionToken = function(){
  var tokenString = localStorage.getItem('token');
  if(typeof(tokenString) == 'string'){
    try{
      var token = JSON.parse(tokenString);
      app.config.sessionToken = token;
      if(typeof(token) == 'object'){
        app.setLoggedInClass(true);
      } else {
        app.setLoggedInClass(false);
      }
    }catch(e){
      app.config.sessionToken = false;
      app.setLoggedInClass(false);
    }
  }
};

// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = function(add){
  var target = document.querySelector("body");
  if(add){
    target.classList.add('loggedIn');
  } else {
    target.classList.remove('loggedIn');
  }
};

// Set the session token in the app.config object as well as localstorage
app.setSessionToken = function(token){
  app.config.sessionToken = token;
  var tokenString = JSON.stringify(token);
  localStorage.setItem('token',tokenString);
  if(typeof(token) == 'object'){
    app.setLoggedInClass(true);
  } else {
    app.setLoggedInClass(false);
  }
};

// Renew the token
app.renewToken = function(callback){
  var currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
  if(currentToken){
    // Update the token with a new expiration
    console.log('Token Id', currentToken.tokenId);
    var payload = {
      'id' : currentToken.tokenId,
      'extend' : true,
    };
    app.client.request(undefined,'token','PUT',undefined,payload,function(statusCode,responsePayload){
      // Display an error on the form if needed
      if(statusCode == 200){
        // Get the new token details
        var queryStringObject = {'id' : currentToken.tokenId};
        app.client.request(undefined,'token','GET',queryStringObject,undefined,function(statusCode,responsePayload){
          // Display an error on the form if needed
          if(statusCode == 200){
            app.setSessionToken(responsePayload);
            callback(false);
          } else {
            app.setSessionToken(false);
            callback(true);
          }
        });
      } else {
        app.setSessionToken(false);
        callback(true);
      }
    });
  } else {
    app.setSessionToken(false);
    callback(true);
  }
};

// Load data on the page
app.loadDataOnPage = function(){
  // Get the current page from the body class
  var bodyClasses = document.querySelector("body").classList;
  var primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false;

  // Logic for account settings page
  if(primaryClass == 'accountEdit'){
    app.loadAccountEditPage();
  }

  // Logic for menu page
  if(primaryClass == 'viewMenu') {
    app.loadViewMenuPage();
  }

  // Logic for dashboard page
  if(primaryClass == 'checksList'){
    app.loadCartListPage();
  }

  // Logic for editItem page
  if(primaryClass == 'editItem') {
    app.loadCartEditPage();
  }

  // Logic for check details page
  if(primaryClass == 'checksEdit'){
    app.loadCartEditPage();
  }

  // Logic for order page
  if(primaryClass == 'order') {
    app.loadOrderListPage();
  }

  // Logic for payment page
  if(primaryClass == 'payment') {
    app.loadPaymentPage();
  }
};

// Load the account edit page specifically
app.loadAccountEditPage = function(){
  // Get the phone number from the current token, or log the user out if none is there
  // var phone = typeof(app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
  var email = typeof(app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false;
  if(email){
    // Fetch the user data
    var queryStringObject = {
      'email' : email
    };
    app.client.request(undefined,'users','GET',queryStringObject,undefined,function(statusCode,responsePayload){
      if(statusCode == 200){
        // Put the data into the forms as values where needed
        document.querySelector("#accountEdit1 .firstNameInput").value = responsePayload.name;
        document.querySelector("#accountEdit1 .lastNameInput").value = responsePayload.address;
        document.querySelector("#accountEdit1 .displayPhoneInput").value = responsePayload.email;

        // Put the hidden phone field into both forms
        var hiddenPhoneInputs = document.querySelectorAll("input.hiddenPhoneNumberInput");
        for(var i = 0; i < hiddenPhoneInputs.length; i++){
            hiddenPhoneInputs[i].value = responsePayload.email;
        }

      } else {
        // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
        app.logUserOut();
      }
    });
  } else {
    app.logUserOut();
  }
};

// Load the cart page
app.loadViewMenuPage = function() {
  // Get the phone number from the current token, or log the user out if none is there
  var email = typeof(app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false;
  if(email){
    document.querySelector("#cartCreate .email").value = email;
  } else {
    app.logUserOut();
  }
}

// Load the dashboard page specifically
app.loadCartListPage = function(){
  // Get the phone number from the current token, or log the user out if none is there
  var email = typeof(app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false;

  if(email){
    // Fetch the user data
    var queryStringObject = {
      'email' : email
    };
    app.client.request(undefined,'users','GET',queryStringObject,undefined,function(statusCode,responsePayload){
      if(statusCode == 200){

        // Determine how many checks the user has
        var allChecks = typeof(responsePayload.cart) == 'object' && responsePayload.cart instanceof Object && Object.keys(responsePayload.cart).length > 0 ? responsePayload.cart : {};
        if(Object.keys(allChecks).length > 0){

          // Show each created check as a new row in the table
          Object.keys(allChecks).forEach(function(itemName){
            var cartObject = allChecks[itemName]
            // Make the check data into a table row
            var table = document.getElementById("cartListTable");
            var tr = table.insertRow(-1);
            tr.classList.add('checkRow');
            var td0 = tr.insertCell(0);
            var td1 = tr.insertCell(1);
            var td2 = tr.insertCell(2);
            var td3 = tr.insertCell(3);
            td0.innerHTML = itemName;
            td1.innerHTML = cartObject.quantity;
            td2.innerHTML = cartObject.total;
            td3.innerHTML = '<a href="/item/edit?item='+itemName.replace(/ /g, '_')+'&quantity='+cartObject.quantity+'">View / Edit / Delete</a>';
          });

          if(Object.keys(allChecks).length < 5){
            // Show the createCheck CTA
            document.getElementById("createCheckCTA").style.display = 'block';
          }

        } else {
          // Show 'you have no checks' message
          document.getElementById("noChecksMessage").style.display = 'table-row';

          // Show the createCheck CTA
          document.getElementById("createCheckCTA").style.display = 'block';

        }
      } else {
        // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
        app.logUserOut();
      }
    });
  } else {
    app.logUserOut();
  }
};

// Load the dashboard page specifically
app.loadOrderListPage = function(){
  // Get the phone number from the current token, or log the user out if none is there
  var email = typeof(app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false;

  if(email){
    // Fetch the user data
    var queryStringObject = {
      'email' : email
    };
    app.client.request(undefined,'orderList','GET',queryStringObject,undefined,function(statusCode,responsePayload){
      if(statusCode == 200){
        // console.log(responsePayload);
        // Determine how many checks the user has
        var allChecks = typeof(responsePayload) == 'object' && responsePayload instanceof Array && responsePayload.length > 0 ? responsePayload : [];
        console.log(allChecks);
        if(allChecks.length > 0){
          // Show each created check as a new row in the table
          allChecks.forEach(function(order){
            console.log(order);
            // Make the check data into a table row
            var table = document.getElementById("orderListTable");
            var tr = table.insertRow(-1);
            tr.classList.add('checkRow');
            var td0 = tr.insertCell(0);
            var td1 = tr.insertCell(1);
            var td2 = tr.insertCell(2);
            var td3 = tr.insertCell(3);
            var td4 = tr.insertCell(4);
            td0.innerHTML = order.id;
            td1.innerHTML = order.name;
            td2.innerHTML = order.email;
            td3.innerHTML = order.address;
            var details = '';
            Object.keys(order.item).forEach((itemName) => {
              var obj = order.item[itemName];

              details += `${itemName} x ${obj.quantity} : ${obj.total}<br>`;
            });
            td4.innerHTML = details;
          });

        } else {
          // Show 'you have no checks' message
          document.getElementById("noChecksMessage").style.display = 'table-row';

          // Show the createCheck CTA
          document.getElementById("createCheckCTA").style.display = 'block';

        }
      } else {
        // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
        app.logUserOut();
      }
    });
  } else {
    app.logUserOut();
  }
};

// Load the dashboard page specifically
app.loadPaymentPage = function(){
  // Get the phone number from the current token, or log the user out if none is there
  var email = typeof(app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false;

  if(email){
    // Fetch the user data
    var queryStringObject = {
      'email' : email
    };
    app.client.request(undefined,'users','GET',queryStringObject,undefined,function(statusCode,responsePayload){
      if(statusCode == 200){
        document.querySelector("#userDetails .name").innerHTML = responsePayload.name;
        document.querySelector("#userDetails .address").innerHTML = responsePayload.address;
        document.querySelector("#userDetails .email").innerHTML = responsePayload.email;

        document.querySelector("#paymentForm .hiddenEmailInput").value = responsePayload.email;

        // Determine how many checks the user has
        var allChecks = typeof(responsePayload.cart) == 'object' && responsePayload.cart instanceof Object && Object.keys(responsePayload.cart).length > 0 ? responsePayload.cart : {};
        if(Object.keys(allChecks).length > 0){
          var sumTotal = 0;
          // Show each created check as a new row in the table
          Object.keys(allChecks).forEach(function(itemName){
            var cartObject = allChecks[itemName]
            // Make the check data into a table row
            var table = document.getElementById("cartListTable");
            var tr = table.insertRow(-1);
            tr.classList.add('checkRow');
            var td0 = tr.insertCell(0);
            var td1 = tr.insertCell(1);
            var td2 = tr.insertCell(2);
            td0.innerHTML = itemName;
            td1.innerHTML = cartObject.quantity;
            td2.innerHTML = cartObject.total;
            sumTotal += cartObject.total;
          });
          var table = document.getElementById("cartListTable");
          var tr = table.insertRow(-1);
          tr.classList.add('checkRow');
          var td0 = tr.insertCell(0);
          var td1 = tr.insertCell(1);
          var td2 = tr.insertCell(2);
          td1.innerHTML = "TOTAL:";
          td2.innerHTML = sumTotal;

        } else {
          // Show 'you have no checks' message
          document.getElementById("noChecksMessage").style.display = 'table-row';

          // Show the createCheck CTA
          document.getElementById("createCheckCTA").style.display = 'block';

        }
      } else {
        // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
        app.logUserOut();
      }
    });
  } else {
    app.logUserOut();
  }
};


// Load the checks edit page specifically
app.loadCartEditPage = function(){
  console.log('Path',window.location.href);
  // Get the check id from the query string, if none is found then redirect back to dashboard
  var item = typeof(window.location.href.split('&')[0].split('=')[1]) == 'string' && window.location.href.split('&')[0].split('=')[1].length > 0 ? window.location.href.split('&')[0].split('=')[1].replace(/_/g, ' ') : false;
  var email = typeof(app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false;
  var quantity =  parseInt(window.location.href.split('=')[2]) !== 'NaN' &&
  window.location.href.split('=')[2] > 0 ? window.location.href.split('=')[2] : false;

  if(item && email && quantity){
    var imageName = item.replace(/ /g, '_');
    var img = document.getElementById('itemImage');
    img.src = 'public/'+imageName+'.jpg';
    // Put the data into the top form as values where needed
    document.querySelector("#cartEdit .email").value = email;
    document.querySelector("#cartEdit .itemName").value = item;
    document.querySelector("#cartEdit .quantity").value = quantity;
    document.querySelector("#itemList").value = item;
    document.querySelector("#cartDelete .hiddenEmailInput").value = email;
    document.querySelector("#cartDelete .hiddenIdInput").value = item;
  } else {
    window.location = '/cart/all';
  }
};

// Loop to renew token often
app.tokenRenewalLoop = function(){
  setInterval(function(){
    app.renewToken(function(err){
      if(!err){
        console.log("Token renewed successfully @ "+Date.now());
      }
    });
  },1000 * 60);
};

// Init (bootstrapping)
app.init = function(){

  // Bind all form submissions
  app.bindForms();

  // Bind logout logout button
  app.bindLogoutButton();

  // Get the token from localstorage
  app.getSessionToken();

  // Renew token
  app.tokenRenewalLoop();

  // Load data on page
  app.loadDataOnPage();

  // Bind on change event for itemList
  document.getElementById('itemList').addEventListener('change', function(e, item) {
    var itemName = typeof(this.value) == 'string' && this.value.length > 0 ? this.value : false;
    var imageName = this.value.replace(/ /g, '_');

    if(itemName) {
      var img = document.getElementById('itemImage');
      img.src = 'public/'+imageName+'.jpg';

      var queryStringObject = {
        itemName
      };
      app.client.request(undefined,'menu','GET',queryStringObject,undefined,function(statusCode,responsePayload){
        if(statusCode === 200) {
          document.getElementById('displayPrice').innerHTML = responsePayload.price;
          document.querySelector("#cartCreate .itemName").value = itemName;
        }
      });
    }
  });

};

// Call the init processes after the window loads
window.onload = function(){
  app.init();
};