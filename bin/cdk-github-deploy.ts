#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AppStage } from '../lib/cdk-github-deploy-stack'
import { GitHubWorkflow } from 'cdk-pipelines-github'
import { ShellStep } from 'aws-cdk-lib/pipelines'

const app = new cdk.App();

const devEnv = {account: '722141136946', region: 'ap-southeast-2'}
const prodEnv = {account: '354334841216', region: 'ap-southeast-2'}

const pipeline = new GitHubWorkflow(app, 'Pipeline', {
  synth: new ShellStep('Build', {
    commands: [
      'npm install',
      'npm run build'
    ]
  }),
  gitHubActionRoleArn: 'arn:aws:iam::722141136946:role/GitHubActionRole'
})

pipeline.addStage(new AppStage(app, 'Dev', {
  env: devEnv
}))

pipeline.addStage(new AppStage(app, 'Prod', {
  env: prodEnv
}))

app.synth()
