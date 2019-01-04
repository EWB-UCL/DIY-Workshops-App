function initCognitoSDK(){
	var authData = {
		ClientId : '8ljobc8u398stdm46gmvvugo4', // Your client id here
		AppWebDomain : 'ucl-ewb-workshops.auth.eu-west-2.amazoncognito.com',
		TokenScopesArray : ['phone','email','openid','aws.cognito.signin.user.admin','profile'], // e.g.['phone', 'email', 'profile','openid', 'aws.cognito.signin.user.admin'],
		RedirectUriSignIn : 'http://localhost:8000/homepage.html',
		RedirectUriSignOut : 'http://localhost:8000'
		//IdentityProvider : '<TODO: add identity provider you want to specify>', // e.g. 'Facebook',
		//UserPoolId : 'eu-west-2_zBeNrhrio', // Your user pool id here
		//AdvancedSecurityDataCollectionFlag : false, // e.g. true
	};
	var auth = new AmazonCognitoIdentity.CognitoAuth(authData);
	//Note:This userhandler doesn't work since the callback is to a different html page???
	auth.userhandler = {
		onSuccess: function(result){
			showSignedIn(result);
		},
		onFailure: function(result){console.log("Error");}
	};
	return auth;
}

function pressButton(auth){
	console.log('test1');
	auth.getSession();
}


function onLoadAWS(){
	console.log('test2');
	var auth = initCognitoSDK();
	console.log(auth);
	document.getElementById("login-btn-init").addEventListener("click",function(){pressButton(auth);});
	var curUrl = window.location.href;
	auth.parseCognitoWebResponse(curUrl);
}

function onLoadMain(){
	//foo is now loaded.
	console.log("test1");
	url = new URL(window.location.href);
	if ((window.location.href).includes("id_token")){
		var tokenId = url.hash.split('&').filter(function(el){if(el.match('id_token')!==null)return true;})[0].split('=')[1];
		var accessId = url.hash.split('&').filter(function(el){if(el.match('access_token')!==null)return true;})[0].split('=')[1];
		var IdPayload = jwt_decode(tokenId);
		console.log(IdPayload);
		var IdPayloadstring = JSON.stringify(IdPayload);
		window.sessionStorage.setItem("tokenId",IdPayloadstring);
		window.sessionStorage.setItem("tokenIdUncoded",tokenId);
		AWS.config.region = 'eu-west-2'; // Region
		AWS.config.update({region: 'eu-west-2'});
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: 'eu-west-2:c206dd94-20fa-48c6-a715-50a572e71ff1',
			Logins:{
				'cognito-idp.eu-west-2.amazonaws.com/eu-west-2_zBeNrhrio': tokenId
			}
		});
		//var postgredb = new AWS.RDS
		var lambda = new AWS.Lambda({region: 'eu-west-2',apiVersion: 'LATEST'});
		console.log(typeof(IdPayload));
		var pullParams = {
			FunctionName: 'postGreConnect',
			InvocationType: 'Event',
			LogType: 'None',
			Payload: JSON.stringify(IdPayload)
		}
		console.log('testfinal');
		var pullResults;
		lambda.invoke(pullParams, function(error,data){
			if (error){
				console.log(error);
			}
			else{
				console.log(data);
				//pullResults = JSON.parse(data.Payload);
				//console.log(data.Payload);
			}
		});
	}
}