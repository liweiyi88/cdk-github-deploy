import { Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib'
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkGithubDeployStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkGithubDeployQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}

export interface AppStageProps extends StageProps {

}

export class AppStage extends Stage {
  constructor(scope: Construct, id: string, props?: AppStageProps) {
    super(scope, id, props)

    const appStack = new CdkGithubDeployStack(this, 'GithubDeployStack')
  }
}
