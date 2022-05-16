#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AppStage } from '../lib/cdk-github-deploy-stack'
import { GitHubWorkflow } from 'cdk-pipelines-github'
import { ShellStep } from 'aws-cdk-lib/pipelines'

const app = new cdk.App();

const primaryEnv = {account: process.env.PRIMARY_ACCOUNT, region: 'ap-southeast-2'}
const secondaryEnv = {account: process.env.SECONDARY_ACCOUNT, region: 'ap-southeast-2'}

const pipeline = new GitHubWorkflow(app, 'Pipeline', {
  synth: new ShellStep('Build', {
    commands: [
      'npm ci',
      'npx cdk synth'
    ]
  }),
  gitHubActionRoleArn: `arn:aws:iam::${primaryEnv.account}:role/GitHubActionRole`
})

pipeline.addStage(new AppStage(app, 'Dev', {
  env: primaryEnv
}))

pipeline.addStage(new AppStage(app, 'Prod', {
  env: secondaryEnv
}))

app.synth()
