노마드 코더님의 인스타그램 클론코딩 강의에 기반하고 있습니다.
자바스크립트와 JSX에 익숙하거나 강의를 수강하신 분을 대상으로 작성하였습니다.  
**다른점**
```
1. Prisma2 사용
2. 백앤드를 AWS 람다로 구현
3. 인증 수단으로 AWS Cognito 사용
4. 멀티 사진 선택기, 인스타그램 댓글 UI 카피 등
```
참조 : [준동's 인스타그램 클론코딩 ](https://joondong.tistory.com/92)  
  
서버리스(Serverless) 프레임워크로 작성되었으며, 배포된 람다 함수를 Amplify로 생성된 AWS Cognito User Pool의 Pre-SignUp 트리거에 등록해야 합니다. 
상세한 내용은 아래 링크를 걸어 두었습니다.
# 수정할 내용
### 1. Lambda 함수 환경변수 설정
AWS Lambda 홈페이지에 접속해서 해당 인스턴스의 환경 변수를 직접 추가해 주어야 한다.  
* DEFAULT_IMAGE : 회원가입시 이미지가 입력되지 않은 경우 기본으로 설정될 이미지  
* ENDPOINT : [백앤드](https://github.com/JoonDong2/instagureng-backend)를 배포할 때 관련 서비스로 생성된 AWS API Gateway 주소  
* USER_POOL_ID: `amplfy`에 의해 생성된 AWS Cognito User Pool의 ID 
참조: [Amplify 초기화](https://joondong.tistory.com/99)
  
**예제**
```
KEY = DEFAULT_IMAGE
VALUE = https://3.bp.blogspot.com/-qtEejOg1NHA/Xobmg2y_QeI/AAAAAAAAIVE/UFKPvpeHjKUqCEFOX8lT4MsKz-PwpEGJgCLcBGAsYHQ/s1600/default_user.png

KEY = ENDPOINT
VALUE = https://31fadsg1e0.execute-api.ap-northeast-2.amazonaws.com/dev/apollo

KEY = USER_POOL_ID
VALUE = ap-northeast-2_DLRUJODP5
```
### 2. handler.js
만약 REGION이 서울(ap-northeast-2)이 아닌 경우에만 수정 (12라인)
```
const cognitoidentityserviceprovider 
  = new AWS.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-19', 
    region: '<YOUR REGION>'
  });
```
  
# 필요한 작업
### 서버리스 AWS Lambda 배포
참조1: [서버리스 GraphQL 백앤드 구성](https://joondong.tistory.com/133)  
참조2: [서버리스 GraphQL 백앤드 구축](https://joondong.tistory.com/136)  
참조3: [서버리스 프레임워크 초기화 및 AWS에 연결](https://joondong.tistory.com/106)  
### AWS Cognito 생성
참조1: [[Git Repository]생성된 Cognito Pool에 Pre-SignUp 이벤트 핸들러](https://github.com/JoonDong2/instagureng-cognito-presignup)  
참조2: [Cognito Pool에 Pre-SignUp 이벤트 핸들러 등록](https://joondong.tistory.com/102)  
  
  
# 참조
### [관련 포스트 목록](https://joondong.tistory.com/151)  
### [인스타그램 클론코딩 웹 (리액트)](https://github.com/JoonDong2/instagureng-frontend)  
### [인스타그램 클론코딩 앱 (리액트 네이티브)](https://github.com/JoonDong2/instagureng-app)  
### [인스타그램 클론코딩 백앤드](https://github.com/JoonDong2/instagureng-backend)