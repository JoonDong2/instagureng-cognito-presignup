'use strict';

const { GraphQLClient } = require('graphql-request');
const AWS = require('aws-sdk');

module.exports.verifier = async (event, context, callback) => {
  console.log("event.request: ", event.request);
  
  const cognitoidentityserviceprovider 
    = new AWS.CognitoIdentityServiceProvider({
      apiVersion: '2016-04-19', 
      region: 'ap-northeast-2'
    });

  const graphQLClient = new GraphQLClient(process.env.ENDPOINT);

  let firstName = "";
  let lastName = "";
  let name = ""
  let picture = "";

  if (event.request.userAttributes.hasOwnProperty("given_name")) {
    firstName = event.request.userAttributes.given_name;
  }
  if (event.request.userAttributes.hasOwnProperty("family_name")) {
    lastName = event.request.userAttributes.family_name;
  }
  if (event.request.userAttributes.hasOwnProperty("name")) {
    name = event.request.userAttributes.name;
  }
  if (event.request.userAttributes.hasOwnProperty("picture")) {
    picture = event.request.userAttributes.picture;
  } else {
    picture = process.env.DEFAULT_IMAGE
  }
  

  // Set the email as verified if it is in the request
  if (event.request.userAttributes.hasOwnProperty("email")) {
      const email = event.request.userAttributes.email;

      const params = {
        "Filter": `email = \"${email}\"`,
        "Limit": 1,
        "UserPoolId": process.env.USER_POOL_ID
      };

      const { Users } = await cognitoidentityserviceprovider.listUsers(params).promise()
      console.log("cog_data", Users)
      if(Users.length > 0) {
        console.log("Cognito에 이미 동일한 이메일을 사용하는 사용자가 존재합니다.")
      }

      if(Users.length > 0) {
        callback("EmailExistError_Cognito");
      } else {
        const userName = event.userName;

        const createAccountMutation = 
        `mutation{
          createAccount(userName: "${userName}", email: "${email}", firstName: "${firstName}", lastName: "${lastName}", name: "${name}", picture: "${picture}")
        }`;
        console.log("Prisma에 계정 생성 요청")
        const { createAccount } = await graphQLClient.request(createAccountMutation);
        console.log("Prisma에 계정 생성")
        console.log(createAccount);
        if(createAccount === "ExistEmailError") {
          callback("EmailExistError_Prisma");
        } else if(createAccount === "ExistUserNameError") {
          callback("UserNameExistError_Prisma");
        }
      }

      //event.response.autoVerifyEmail = true;
  }

  // Return to Amazon Cognito
  callback(null, event);
};
