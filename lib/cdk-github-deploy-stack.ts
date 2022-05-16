import { Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib'
import { Construct } from 'constructs';
import { StringParameter } from 'aws-cdk-lib/aws-ssm'

export class CdkGithubDeployStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new StringParameter(this, 'GithubParam', {
      parameterName: '/gh-deploy',
      stringValue: 'julian-test'
    })
  }
}

export class AppStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props)

    new CdkGithubDeployStack(this, 'GithubDeployStack')
  }
}
