# Bootstrap
## Bootstrap your primary aws account
```
AWS_PROFILE=cmdlab-sandpit1 npx cdk bootstrap --qualifier ghdeploy aws://[primary-account-id]/ap-southeast-2 --trust-for-lookup [second-account-id] --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess
```
## Bootstrap your secondary aws account
```
AWS_PROFILE=cmdlab-sandpit2 npx cdk bootstrap --qualifier ghdeploy aws://[second-account-id]/ap-southeast-2 --trust [primary-account-id] --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess
```
## Configure cdk.json
Add `"@aws-cdk/core:bootstrapQualifier": "ghdeploy",` in the context section. The `cdk.json` file tells the CDK Toolkit how to execute your app.

# Github OIDC Role
You only need to create the role in your primary AWS account.

## Create Identity providers
![CreateIdentityProvider](doc/create_identity_provider.png)

## Create IAM Policy `CDKDeployPermissionPolicy`
![Create IAM Policy](doc/create_iam_policy.png)
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
## Create the `GitHubActionRole` role
Choose web identity
![CreateIAMRole1](doc/create_iam_role1.png)
Attach the policy
![CreateIAMRole2](doc/create_iam_role2.png)

## 3. Edit `GitHubActionRole` Role's trust policy 
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::[primary-account-id]:oidc-provider/token.actions.githubusercontent.com"
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
