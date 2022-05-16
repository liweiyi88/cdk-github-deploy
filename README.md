# Bootstrap
## Bootstrap your primary aws account
`AWS_PROFILE=cmdlab-sandpit1 npx cdk bootstrap --qualifier ghdeploy aws://722141136946/ap-southeast-2 --trust-for-lookup 354334841216 --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess`

## Bootstrap your secondary aws account
`AWS_PROFILE=cmdlab-sandpit2 npx cdk bootstrap --qualifier ghdeploy aws://354334841216/ap-southeast-2 --trust 722141136946 --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess`

## Configure cdk.json
Add `"@aws-cdk/core:bootstrapQualifier": "ghdeploy",` in the context section. The `cdk.json` file tells the CDK Toolkit how to execute your app.

# Github OIDC Role
## Create Identity providers

1. Create IAM Policy `CDKDeployPermissionPolicy`
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Condition": {
                "ForAnyValue:StringEquals": {
                    "iam:ResourceTag/aws-cdk:bootstrap-role": [
                        "deploy",
                        "lookup",
                        "file-publishing",
                        "image-publishing"
                    ]
                }
            },
            "Action": "sts:AssumeRole",
            "Resource": "*",
            "Effect": "Allow"
        },
        {
            "Action": "ecr:GetAuthorizationToken",
            "Effect": "Allow",
            "Resource": "*"
        }
    ]
}
```
## 2. Create the role
Trusted entity type: Web identity -> OpenID Connect -> provider URL: Use https://token.actions.githubusercontent.com
-> For the "Audience": Use sts.amazonaws.com if you are using the official action.

## 3. Edit `GitHubActionRole` Role's trust policy 
```
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Principal": {
				"Federated": "arn:aws:iam::354334841216:oidc-provider/token.actions.githubusercontent.com"
			},
			"Action": "sts:AssumeRoleWithWebIdentity",
			"Condition": {
				"StringEquals": {
					"token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
				},
				"StringLike": {
				    "token.actions.githubusercontent.com:sub": [
				        "repo:liweiyi88/*:ref:refs/heads/*",
				        "repo:liweiyi88/*:environment:*"
				    ]
				}
			}
		}
	]
}
```
